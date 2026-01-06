const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

// Starting app
app.listen(config.PORT, () => {
  logger.info('App', 'Server running on port', config.PORT)
})
