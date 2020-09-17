const _ = require('lodash')
const {pathToRegexp }= require('path-to-regexp')
const Router = require('koa-joi-router-support')
const Joi = Router.Joi
const routersPath = `${__dirname}/../routers`
const routePath = {}
const config = require('../config')
const env = require('../env')
const buildDoc = ({ usePathToRegexp }) => {
  const isJoi = test => {
    let joiObj

    if (test && Joi.isSchema(test)) {
      joiObj =  test
    } else if (test) {
      joiObj =Joi.object().keys(test)
    } else {
      joiObj = Joi.object()
    }

    return joiObj
  }

  const transfer = output => {
    let response = {}
    Object.keys(output).forEach(item => {
      response[item] = {}
      response[item].schema = output[item].body
    })

    return response
  }

  const MainRouter = require(routersPath)
  const tags = []
  const mainRouter = MainRouter.init({
    use: () => {
    }
  })

  const buildName = (url) => {
    const keys = []
    pathToRegexp(url, keys)
    let name = url

    usePathToRegexp&& keys.forEach((item) => {
      name = name.replace(`:${item.name}`, `{${item.name}}`)
    })
    return name
  }

  for (const layer of mainRouter.router.stack) {
    if (!layer.joiRouter) continue
    const joiRouter = layer.joiRouter
    let name = buildName(layer.path)

    tags.push({ name: joiRouter.group, description: joiRouter.groupDescription? ' ' + joiRouter.groupDescription: undefined })
    const newObj = {}
    newObj[name] = {}
    newObj[name][joiRouter.method[0]] = {
      tags: [joiRouter.group], // 把router的description 写在这里，swagger 2.0 不支持
      parameters: {},
      summary: joiRouter.description,
      security: [{
        JWT: []
      }]
    }
    if (joiRouter.validate) {
      joiRouter.method.forEach((method) => {
        if (!newObj[name][method]) {
          newObj[name][method] = {}
        }

        Object.assign(newObj[name][method], {
          parameters: {
            header: joiRouter.validate.header || Joi.object(),
            query: isJoi(joiRouter.validate.query) || Joi.object(),
            pathParams: isJoi(joiRouter.validate.params) || Joi.object(),
            body: isJoi(joiRouter.validate.body) || Joi.object()
          },
          responses: transfer(joiRouter.validate.output)
        })
      })

    }
    _.defaultsDeep(routePath, newObj)
  }

  return {
    swagger: '2.0.0',
    info: {
      title: 'API',
      description: 'API',
      version: '1.0.0'
    },
    //  the domain of the service
    host: env.SWAGGER_PROXY,
    //  array of all schemes that your API supports
    schemes: ['http'],
    //  will be prefixed to all paths
    basePath: '/',
    consumes: ['application/x-www-form-urlencoded'],
    produces: ['application/json'],
    allowEmptyValue: false,
    tags: _.uniqBy(tags, 'name'),
    securityDefinitions: {
      JWT: {
        description: '',
        type: 'apiKey',
        name: config.session.tokenKey,
        in: 'header'
      }
    },
    prefix: mainRouter.router.opts.prefix,
    paths: routePath
  }
}

module.exports = buildDoc
