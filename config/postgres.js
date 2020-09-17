const env = require('../env')
module.exports = {
  // with database, username, and password
  dialect: 'postgres',
  username: env.POSTGRES_AUTH_USER,
  password: env.POSTGRES_AUTH_PWD,
  // with database
  database: env.POSTGRES_DATABASE || 'postgres',
  // with uri
  host: env.POSTGRES_HOST || '127.0.0.1',
  port: env.POSTGRES_PORT || 5432,
  pool: {
    // Maximum number of connection in pool
    max: env.POSTGRES_OPTIONS_POOL_MAX
      ? parseInt(env.POSTGRES_OPTIONS_POOL_MAX)
      : 5,
    // Minimum number of connection in pool
    min: env.POSTGRES_OPTIONS_POOL_MIN
      ? parseInt(env.POSTGRES_OPTIONS_POOL_MIN)
      : 1,
    // The maximum time, in milliseconds, that a connection can be idle before being released.
    idle: env.POSTGRES_OPTIONS_POOL_IDLE
      ? parseInt(env.POSTGRES_OPTIONS_POOL_IDLE)
      : 10000,
    // The maximum time, in milliseconds, that pool will try to get connection before throwing error
    acquire: env.POSTGRES_OPTIONS_POOL_ACQUIRE
      ? parseInt(env.POSTGRES_OPTIONS_POOL_ACQUIRE)
      : 60000
  },
  logging: env.DEBUG === 'true' ? true : false,
  retry: {
    // How many times a failing query is automatically retried. Set to 0 to disable retrying on SQL_BUSY error.
    max: 3
  },
  benchmark: true,
  constraints: env.POSTGRES_CONSTRAINTS === 'true' ? true : false
}
