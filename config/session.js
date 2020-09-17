const env = require('../env')

module.exports = {
  prefix: env.SESSION_PREFIX || 'sess:',
  maxAge: env.SESSION_MAX_AGE ? parseInt(env.SESSION_MAX_AGE) : 7200000,
  tokenKey: env.SESSION_TOKEN_KEY || 'token'
}
