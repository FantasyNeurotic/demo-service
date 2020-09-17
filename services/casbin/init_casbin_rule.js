const path = require('path')
process.env.ENV_FILE = path.join(__dirname, '/../../', 'env', 'development.env')
const models = require('../../models')
const Router = require('koa-joi-router-support')
const Joi = Router.Joi
const buildSwaggerDoc = require('../../swagger/mix_doc')
const Casbin = require('./index')
const casbin = new Casbin()
const joiJson = require('joi-to-json-schema-support')
const _ = require('lodash')
/*
 * 权限：
 * 超级管理员权限 /*
 * 各平台管理员权限 /admin/*
 * 各API基础权限 带input参数和output参数 prefix
 * 
 * 角色：
 * 超级管理员角色 (1)
 * 各平台管理员角色 （2）
 * 各平台基础权限集合角色 （3）(默认全部都是允许访问)
 * 偏向业务且可赋予授权的权限集合角色 （3）（可被普通用户操作的权限）
 * 偏向系统且是禁止做某些操作的权限集合角色 （3）（不可被普通用户操作）
 * 普通角色-> 事实上是基础权限集合角色 + 偏向业务 + 偏向系统 （主要的权限差异在于偏向业务权限）
 * 
 * 用户
 * 超级管理员用户(系统)
 * 赋予操作创建各平台管理员用户，角色，偏向业务，偏向系统，基础权限角色，编辑权限
 * 
 * 各平台管理员用户(系统)
 * 赋予操作创建下属管理员用户，普通用户，偏向业务，偏向系统，基础权限角色，编辑权限（只限于各平台，不能跨平台操作）
 * 
 * 下属管理员用户（自建，下一级管理员同此）
 * 创建下一级管理员用户，普通用户， 偏向业务
 * 
 * 普通用户
 * 赋予普通角色，遵从其权限范围
*/



const swaggerDoc =  buildSwaggerDoc({ usePathToRegexp: false})
const uuid = require('uuid').v3

const initPolicy = async () =>  {
  const enforcer = await casbin.initABACStrategy()
  const allAction = '*'
  // 创建超级管理员
  // 在swaggerdoc 里面如果有标记, 划分到特殊权限组
  const rootPolicy = `root:${uuid('root', uuid.URL)}`
  const rootRoleName = 'role:root'
  const baseRoleName = 'role:base'
  await enforcer.addPolicy(rootPolicy, '/*',allAction, 'allow')
  await enforcer.addGroupingPolicy(rootRoleName, rootPolicy)
  // 创建各平台权限
  const appURL = `${swaggerDoc.prefix}.*`
  await enforcer.addPolicy(`admin:${uuid(appURL + allAction, uuid.URL)}`, appURL, allAction, 'allow')
  
  Object.entries(swaggerDoc.paths).forEach(async(item)=> {
    let key = item[0]
    const value = item[1]
    const arr = Object.keys(value)

    // if (arr.length > 1) {
    //   arrPromise.push(enforcer.addPolicy(`api:${uuid(key + allAction, uuid.URL)}`, `${key}`, allAction, 'allow'))
    // }
    for (let p of arr) {
      const apiPolicyName = `oneapi:${uuid(key + p.toUpperCase(), uuid.URL)}`
      const instance =  await models.SchemaJson.findOne({ where: { api_id: apiPolicyName }})
      const info = { api_id: apiPolicyName, schema_json: joiJson.convert(Joi.compile(value[p].parameters)) }
      instance ? await instance.update(info) : await models.SchemaJson.create(info)
      key = _.trimEnd(key, '/')
      enforcer.addPolicy(apiPolicyName, `${key}.*`, p.toUpperCase(), 'allow')
      enforcer.addGroupingPolicy(baseRoleName, apiPolicyName)
    }
  })
}

initPolicy()

