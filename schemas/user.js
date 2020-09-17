const Joi = require('koa-joi-router-support').Joi

const signIn = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required()
})
const signUp = Joi.object().keys({
  username: Joi.string().max(64).required(),
  tel: Joi.string().max(14).min(11).required(),
  email: Joi.string().max(128).allow(''),
  password: Joi.string().max(32).required(),
  name: Joi.string().max(64)
})

const token = Joi.object().keys({
  token: Joi.string()
}).unknown()

module.exports = {
  signIn,
  signUp,
  token
}