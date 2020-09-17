const Boom = require('@hapi/boom')
const models = require('../models')
const utils = require('../services/utils')
const jwt = require('jsonwebtoken')
const config = require('../config')
module.exports = {
  signIn: async (ctx) => {
    const { username, password } = ctx.request.body
    const user = await models.User.findOne({ where: { username }})
    if (!user) {
      return ctx.throw(Boom.unauthorized('Invalid user'))
    }
    const match = utils.crypto.bcrypt.compareSync(password, user.password)

    if (!match) {
      return ctx.throw(Boom.badRequest('Invalid password'))
    }
    Object.assign(ctx.session,{ loginUserId: user.id})
    const token = jwt.sign({ sessionId: ctx.session._sessCtx.externalKey }, config.server.secretKey)
    return ctx.success({ token })
  },
  signUp: async (ctx) => {
    const body = ctx.request.body
    const user = await models.User.findOne({ where: { username: body.username }})
    if (user) {
      return ctx.throw(Boom.badRequest('Sorry, the user name has been used. '))
    }

    body.password = utils.crypto.password(body.password)
    await models.User.create(body)
    return ctx.success()
  },
  current: async (ctx) => {
    if(! (ctx.state && ctx.state.loginUser)) {
      return ctx.throw(Boom.unauthorized())
    }
  
    return ctx.success(ctx.state.loginUser)
  }
}