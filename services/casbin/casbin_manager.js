const path = require('path')
process.env.ENV_FILE = path.join(__dirname, '/../../', 'env', 'development.env')
const CasbinServices = require('./index')
const models = require('../../models')
const casbinServices = new CasbinServices()


class CasbinManager {
  constructor() {
    this.enforcer = null
  }

  async getEnforcer() {
    if (!this.enforcer) {
      this.enforcer = await casbinServices.initABACStrategy()
    }
    return this.enforcer
  }

  async deleteRole(roleName) {
    const enforcer = await this.getEnforcer()
    await enforcer.deleteRole(roleName)
  }

  async addPermissionForUser(user, policies) {
    const enforcer = await this.getEnforcer()
    await enforcer.addPermissionForUser(user, policies)
  }
  async deletePermissionForUser(user, policies) {
    const enforcer = await this.getEnforcer()
    await enforcer.deletePermissionForUser(user, policies)
  }

  async getPermissionsForUser(user) {
    const enforcer = await this.getEnforcer()
    enforcer.addGroupingPolicies
    const permissions = await enforcer.getPermissionsForUser(user)
    return permissions
  }


  async addGroupingPolicies(role, policies) {
    const enforcer = await this.getEnforcer()
    await enforcer.addGroupingPolicies(role, policies)
  }

  async getFilteredPolicy(policyName) {
    const enforcer = await this.getEnforcer()
    const policy = await enforcer.getFilteredPolicy(0, policyName)
    return policy && policy[0]
  }

  async addPolicy({ subject, object , action, eft, inputSchema, outputSchema} = {}) {
    const enforcer = await this.getEnforcer()
    await enforcer.addPolicy(subject, object, action, eft, inputSchema, outputSchema)
  }

  async removePolicy({ subject, object , action, eft, inputSchema, outputSchema} = {}) {
    const enforcer = await this.getEnforcer()
    await enforcer.removePolicy(subject, object, action, eft, inputSchema, outputSchema)
  }


  async addLink(user, role) {
    const enforcer = await this.getEnforcer()
    const  roleManager = enforcer.getRoleManager()
    await roleManager.addLink(user, role)
  }

  async hasLink(user, role) {
    const enforcer = await this.getEnforcer()
    const  roleManager = enforcer.getRoleManager()
    return await roleManager.hasLink(user, role)
  }

  async deleteLink(user, role) {
    const enforcer = await this.getEnforcer()
    const  roleManager = enforcer.getRoleManager()
    await roleManager.deleteLink(user, role)
  }

  async getRoles(user) {
    const enforcer = await this.getEnforcer()
    const  roleManager = enforcer.getRoleManager()
    const roles = await roleManager.getRoles(user)
    
    return roles
  }

  async getUsers(role) {
    const enforcer = await this.getEnforcer()
    const  roleManager = enforcer.getRoleManager()
    const users = await roleManager.getUsers(role)

    return users
  }

  async getBasePolicies() {
    const schemas = await models.SchemaJson.findAll({ where: {type: 1}, attributes: ['api_id', 'id', 'schema_json'], raw: true})
    const enforcer = await this.getEnforcer()
    const a = await enforcer.model.getFilteredPolicy('g', 'g', 0, 'role:base')
    const b = await enforcer.getPolicy()
    const c = b.filter((item) => {
      return a.find((item1) => {
        const result = item1[1] === item[0]
        if (result) {
          const schema = schemas.find((item2)=> item2.api_id === item[0])
          if (schema) {
            item.schema = schema.schema_json
          }
        }
        return result
      })
    })

    return c
  }


  async getBusinessPolicies(roleName) {
    const schemas = await models.SchemaJson.findAll({ attributes: ['api_id', 'id', 'schema_json'], raw: true})
    const enforcer = await this.getEnforcer()
    const a = await enforcer.model.getFilteredPolicy('g', 'g', 0, roleName)
    const b = await enforcer.getPolicy()
    const c = b.filter((item) => {
      return a.find((item1) => {
        const result = item1[1] === item[0]
        if (result) {
          const schema = schemas.find((item2)=> item[4] && item2.id === item[4] || item2.api_id === item[0])
          if (schema) {
            item.schema = schema.schema_json
          }
        }
        return result
      })
    })

    return  c
  }
}
const manager = new CasbinManager()
manager.addLink('e11a3a7a-92c3-4864-9f25-610a90102508', 'role:root')
// manager.addLink('3af2d335-bef5-4dd2-9814-c560a01ffda5', 'role:base')
manager.getRoles('e11a3a7a-92c3-4864-9f25-610a90102508')
// manager.getPermissionsForUser('3af2d335-bef5-4dd2-9814-c560a01ffda5')
// manager.getFilteredPolicy('oneapi:2db56190-0df0-3337-935e-fbace593258f')
module.exports = CasbinManager
