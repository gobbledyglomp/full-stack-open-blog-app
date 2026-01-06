require('dotenv').config()

const PORT = process.env.PORT

const ENV = process.env.NODE_ENV
console.log(`[App] Running in ${ENV} environment`)

const MONGODB_URI =
  ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI

const SECRET = process.env.SECRET

module.exports = { PORT, ENV, MONGODB_URI, SECRET }
