const env = require('../env')

module.exports = {
  // with database, username, and password
  auth: env.REDIS_AUTH_PWD ? { pwd: env.REDIS_AUTH_PWD } : null,
  // with database
  database: env.REDIS_DATABASE || '',
  // with uri
  host: env.REDIS_HOST || '127.0.0.1',
  port: env.REDIS_PORT || 6379
}