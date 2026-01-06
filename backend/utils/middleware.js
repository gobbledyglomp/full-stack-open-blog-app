const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const logger = require('./logger')

const User = require('../models/user')

// Token extractor
const tokenExtractor = (request, response, next) => {
  request.token = null
  const authorization = request.get('authorization')

  // Authenticate user
  if (authorization && authorization.startsWith('Bearer ')) {
    const encodedToken = authorization.replace('Bearer ', '')
    const decodedToken = jwt.verify(encodedToken, config.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({
        error: 'token invalid',
      })
    }

    request.token = decodedToken
  }

  next()
}

// User extractor
const userExtractor = async (request, response, next) => {
  request.user = null

  // If user is authenticated and exists, request.user shouldn't be null
  if (request.token) {
    const user = await User.findById(request.token.id)

    if (!user) {
      return response.status(400).json({
        error: 'UserId missing or not valid',
      })
    }

    request.user = user
  }

  next()
}

// Request logger
morgan.token('body', (request) => JSON.stringify(request.body))
const requestLogger = morgan(
  '[HTTP] :method :url :status :res[content-length] - :response-time ms :body',
)

// Unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Error handler
const errorHandler = (error, request, response, next) => {
  logger.error('App', error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    return response
      .status(400)
      .json({ error: `'${error.keyValue.username}' already exists` })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired',
    })
  }

  next(error)
}

module.exports = {
  tokenExtractor,
  userExtractor,
  requestLogger,
  unknownEndpoint,
  errorHandler,
}
