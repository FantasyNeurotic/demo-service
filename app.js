/**
 * @class API
 */
const Koa = require('koa')
const compress = require('koa-compress')
const Boom = require('@hapi/boom')

const socketIO = require('./services/socket.io.js')
const middlewares = require('./middlewares')
const app = new Koa()
const config = require('./config')

app.keys = [config.server.secretKey]
//支持gzip
const options = { threshold: 2048 }
app.use(compress(options))
app.use(middlewares.bodyParser)
app.use(middlewares.cors)
middlewares.session(app)
app.use(middlewares.injectCTX)
app.use(middlewares.ctxUUID)

const routers = require('./routers')
const router = routers.init(app)
app.use(router.middleware()).use(router.router.allowedMethods({
  throw: true,
  notImplemented: () => Boom.notImplemented(),
  methodNotAllowed: () => Boom.methodNotAllowed()
}))
app.on('error', () => {
})

async function start() {
  socketIO.init(app).listen(16600)
  console.info('Koa listening on port, socket.io is usable.')
}

start()


process.on('uncaughtException', (e) => {
  console.error('Oh! uncaughtException occurs.')
  console.error(e.stack)
  process.exit(1)
})

