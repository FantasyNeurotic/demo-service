const Router = require('koa-joi-router-support')
const Casbin = require('../services/casbin')
const loadUser = require('../middlewares/load_user')
const user = require('./user')


module.exports = {
  init: () => {
    const casbin = new Casbin()
    const router = new Router()
    router.setStrategy([loadUser, casbin.ABAC()])
    router.prefix('/api')
    router.assemble('/user', user)
    return router
  }
}
