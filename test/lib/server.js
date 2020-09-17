'use strict'

const proxyquire = require('proxyquire').noCallThru()
const Stubs      = require('./stubs')
const request = require('supertest')
const compress = require('koa-compress')

const Koa = require('koa')
const path = require('path')
const childProcess = require('child_process')
const stubs      = new Stubs()

const defaultOptions = {
  useStubs: false,
  port: 5000
}

class Server {
  constructor(options) {
    //实例化app
    const app = new Koa()
    this.options = Object.assign(defaultOptions, options || {})
    if (this.options.useStubs) {
      if (!this.options.stubsPath) {
        throw new Error('If Stubs are enabled, stubsPath needs to be provided')
      }

      stubs.setStubsPath(this.options.stubsPath)
      this.cachedStubs = stubs.getStubs()
    } else {
      if (!process.env.ENV_FILE) {
        app.env = 'test'
        process.env.ENV_FILE = path.join(__dirname + '/../../', 'env', `${app.env}.env`)
      }
      if (!process.env.ENV_SECRET_FILE) {
        process.env.ENV_SECRET_FILE = path.join(__dirname + '/../../', '.envsecret')
      }
    }
    const middlewares = require('../../middlewares')
    const env = require('../../env')
    const socketIO = require('../../services/socket.io')

    const routers = this.options.useStubs ? proxyquire('../../routers', Object.assign({
      '../middlewares/load_user': async (ctx, next) => {
        Object.assign(ctx.state, { loginUser: {
          id: 'e11a3a7a-92c3-4864-9f25-610a90102508'
        }})
        return next()
      },
      '../services/casbin': function()  {
        return {
          ABAC: () => {
            return function(ctx, next) {
              return next()
            }
          }
        }
      }}, this.cachedStubs)) : require('../../routers')
  
    process.on('uncaughtException', (e) => {
      process.exit(1)
    })

    //配置全局中间件
    app.keys = [env.SESSION_TOKEN_KEY]
    app.use(middlewares.ctxUUID)
    app.use(middlewares.injectCTX)
    app.use(middlewares.cors)
  
    //转换post数据为json，file
    app.use(middlewares.bodyParser)
    app.use(compress(options))
    socketIO.init(app)
    const router = routers.init(app)
    app.use(router.middleware())

    this.server = app
  }

  static getInstance(options) {
    if (!this.instance) {
      this.instance = new Server(options)
    }
    return this.instance
  }


  getStubs() {
    if (this.options.useStubs) {
      return this.cachedStubs
    }

    return null
  }
  inject() {
    return request(this.server.listen())
  } 

  initDB() {
    try {
      childProcess.execSync('npx sequelize db:migrate  --env=test && npx sequelize db:seed:all --env=test')
    } catch(e) {
      console.log(e)
    }
  }

}

module.exports = Server
