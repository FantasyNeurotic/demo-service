const Debug = require('debug') 
const joi2jsonSchema = require('joi-to-json-schema-support').convert
const cloneDeepWith = require('lodash/cloneDeepWith') 

const ctx2paramMap = {
  'pathParams': 'path',
  'query': 'query',
  'headers': 'header',
  'body': 'formData'
}

const joiKey = 'jsonSchema'

function toSwaggerParams(joiMap) {
  let params = []
  Object.keys(joiMap).forEach(key => {
    const fullJsonSchema = joi2jsonSchema(joiMap[key])
    for (let name in fullJsonSchema.properties) {
      const jsonSchema = fullJsonSchema.properties[name]
      const paramType = ctx2paramMap[key]
      const param = {
        name,
        allowEmptyValue: true,
        in: paramType,
        required: fullJsonSchema.required && fullJsonSchema.required.indexOf(name) >= 0
      }
      if (paramType === 'body') {
        param.schema = jsonSchema
      } else {
        Object.assign(param, jsonSchema)
      }
      params.push(param)
    }
  })
  params[joiKey] = joiMap
  return params
}
function toSwaggerDoc(mixedSchema) {
  const swaggerDoc = cloneDeepWith(mixedSchema, value => {
    if (value && typeof value === 'object' && value.isSchema &&  value.isSchema() === true) {
      return value.clone()
    }
  })

  for (let path in swaggerDoc.paths) {
    const pathInfo = swaggerDoc.paths[path]
    for (let method in pathInfo) {
      const methodInfo = pathInfo[method]
      methodInfo.parameters = toSwaggerParams(methodInfo.parameters)
      
      for (let status in methodInfo.responses) {
        const resInfo = methodInfo.responses[status]
        if (resInfo.schema) {
          resInfo.schema = joi2jsonSchema(resInfo.schema)
        }
      }
    }
  }

  return swaggerDoc
}
module.exports = {
  debug: Debug('joi-swagger'),
  toSwaggerParams,
  toSwaggerDoc
}
