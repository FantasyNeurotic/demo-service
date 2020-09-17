const Router = require('koa-joi-router-support')
const router = new Router()
const userC = require('../controllers').user
const { user, common } = require('../schemas')

const routes = [{
  method: 'post',
  path: '/sign_in',
  validate: {
    type: ['json'],
    body: user.signIn,
    output: common.output.anonymous
  },
  strategy: false,
  handler: [userC.signIn]
}, {
  method: 'post',
  path: '/sign_up',
  validate: {
    type: ['json'],
    body: user.signUp,
    output: common.output.anonymous
  },
  strategy: false,
  handler: [userC.signUp]
}, {
  method: 'get',
  path: '/current',
  validate: {
    header: user.token,
    output: common.output.anonymous
  },
  strategy: true,
  handler: [userC.current]
}]

router.route(routes)
module.exports = router