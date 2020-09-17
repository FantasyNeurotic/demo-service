const session = require('koa-session')
const redisStore = require('koa-redis')
const jwt = require('jsonwebtoken')
const connections = require('../connections')
const config = require('../config')

module.exports = (app) => {
  const sessionConfig = {
    prefix: config.session.prefix,
    maxAge: config.session.maxAge,
    autoCommit: true,
    overwrite: true,
    rolling: true,
    renew: false,
    externalKey: {
      get(ctx) {
        const token = ctx.headers[config.session.tokenKey] || ctx.request.query[config.session.tokenKey]
        try {
          if (token) {
            const payload = jwt.verify(token, config.server.secretKey)
            return payload.sessionId
          }
        } catch (error) {
          return null
        }
      },
      set(ctx, externalKey) {

      }
    },
    store: redisStore({
      client: connections.redis
    })
  }
  app.use(session(sessionConfig, app))
}