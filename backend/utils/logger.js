const config = require('./config')

const info = (source, ...params) => {
  if (config.ENV !== 'test') {
    console.log(`[${source}]`, ...params)
  }
}

const error = (source, ...params) => {
  if (config.ENV !== 'test') {
    console.error(`[${source}]`, ...params)
  }
}

module.exports = {
  info,
  error,
}
