const UserModel = require('../models').User

module.exports = async (ctx, next) => {
  let loginUserId = ctx.session.loginUserId

  if (loginUserId) {
    const user =  await UserModel.findByPk(loginUserId, {
      attributes: { exclude: ['password'] }
    })
    if (!user) {
      return ctx.throws(404)
    }
    Object.assign(ctx.state, {loginUser: user})
    return next()
  } else {
    return next()
  }
}