const casbin = require('casbin')
const authz = require('koa-authz')
const BasicAuthorizer = require('koa-authz/BasicAuthorizer')
const enjoi = require('enjoi')
const _ = require('lodash')

class MyAuthorizer extends BasicAuthorizer {
  // override function
  getUserName () {
    const { id } = this.ctx.state.loginUser
    return id
  }
  async checkPermission () {
    const {ctx, enforcer} = this
    let { method } = ctx
    const user = this.getUserName()
  
    return await enforcer.enforce(user,ctx, method)
  }
}

class Casbin {
  constructor() {
    this.enforcer = null
    this.policys = null
  }

  async loadPolicys() {
    const { SequelizeAdapter } = require('casbin-sequelize-adapter')
    const postgresConfig = require('../../config').postgres
    // load the casbin model and policy from files, database is also supported.
    const policys = await SequelizeAdapter.newAdapter({
      username: postgresConfig.username,
      password: postgresConfig.password,
      port: postgresConfig.port,
      host: postgresConfig.host,
      database: 'demo',
      dialect: 'postgres'
    })


    return policys
  }
  async initABACStrategy() {
    const policys = this.policys || await this.loadPolicys()
    const models = require('../../models')
    const schemasJson = await models.SchemaJson.findAll({ raw: true})
    const enforcer = await casbin.newEnforcer(`${__dirname}/authz_abac_with_deny_model.conf`, policys)
    enforcer.enableLog(true)
    const  regexMatch =(key1, key2)=> {
      return new RegExp(key2).test(key1)
    }
    const  keyMatch2 = (key1, key2)=>{
      key2 = key2.replace(/\/\*/g, '/.*')
    
      const regexp = new RegExp(/(.*):[^/]+(.*)/g)
      for (;;) {
        if (!_.includes(key2, '/:')) {
          break
        }
        key2 = key2.replace(regexp, '$1[^/]+$2')
      }
    
      return regexMatch(key1, '^' + key2 + '$')
    }
    const abacMatch = (ctx, p, inputSchema) =>{
      // path
      // 当接口不同时,返回false进行下一个判断
      let result = keyMatch2(ctx.path, p)
  
      if (!result) {
        return result
      }
      // 当有schema校验时, 有错误应当抛出错误
      if (inputSchema) {
        const inputSchemasJson = schemasJson.find((item) => item.id === inputSchema)
        if (!inputSchemasJson) {
          return true
        }
        console.log(inputSchemasJson.schema_json)
        const info = {
          query: ctx.request.query,
          body: ctx.request.body,
          params: ctx.params,
          where: {}
        }
        const { error, value } = enjoi.schema(inputSchemasJson.schema_json).validate(info, {  convert: true, stripUnknown: true })
        if (error) {
          const businessError = new Error(error.message)
          businessError.status = 403
          throw businessError
        }
        console.log(value.where)
        if (value.where) {
          if (!ctx.request.query.where) {
            ctx.request.query.where = {}
          }
          // 覆盖？
          Object.assign(ctx.request.query.where, value.where)
        }
      
      }

      return result
    }
    const hello = (...args) => {
      return abacMatch(args[0], args[1], args[2])
    }
    enforcer.addFunction('abacMatch', hello)
    this.enforcer = enforcer
    this.policys = policys
    return enforcer
  }
  
  ABAC() {
    return (ctx, next) => {
      return authz({
        newEnforcer: async() => {
          try {
            this.enforcer || await this.initABACStrategy()
            return this.enforcer
          } catch(e) {
            console.log('-------------', e)
          }
        },
        authorizer: (ctx, option = this.enforcer) => new MyAuthorizer(ctx, option)
      })(ctx, next)
    }  
  }
}
module.exports = Casbin