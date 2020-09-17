const Koa = require('koa')
const app = new Koa()
const { toSwaggerDoc } = require('./utils')
const ui = require('./ui')
const path = require('path')
process.env.ENV_FILE = path.join(__dirname, '/../', 'env', 'swagger.env')

const mixedDoc = require('./mix_doc')
const env = require('../env')

const docs = mixedDoc({ usePathToRegexp: true})
const swaggerDoc = toSwaggerDoc(docs)

app.use(
  ui(swaggerDoc, {
    pathRoot: '/swagger', // optional, swagger path
    //UIHtml: require('./default-html'),
    skipPaths: [], // optional, skip paths
    sendConfig: { maxage: 3600 * 1000 * 24 * 30 }, // optional, config for koa-send, default maxage is 1 month.
    v3: true // optional, default is v2, you need to install optional dependencies `swagger-ui-dist` first.
  })
)

app.listen(env.SWAGGER_PORT)
console.log('Swagger server start', env.SWAGGER_PORT)
