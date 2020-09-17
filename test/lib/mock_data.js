module.exports = (schema, input) => {
  const Felicity = require('felicity')
  const JoiSequelize = require('joi-sequelize-support')
  const _ = require('lodash')
  let flag = false
  const modelScheam = new JoiSequelize(function(sequelize, DataTypes) {
    const attributes = _.cloneDeep(schema)
    for (let item in attributes) { 
      attributes[item].type = DataTypes[attributes[item].type.key]
      if (attributes[item].defaultValue) {
        attributes[item].defaultValue = typeof(attributes[item].defaultValue) === 'function' ? DataTypes[attributes[item].defaultValue.key] : attributes[item].defaultValue
      }
      if (item === 'schema') {
        flag = true
        attributes['xxschema'] = attributes[item]
        delete attributes[item]
      }
    }

    return sequelize.define('test', attributes)
  })

  const FelicityModelConstructor = Felicity.entityFor(modelScheam._joi)
  const modelInstance = new FelicityModelConstructor(input)
  if (flag) {
    modelInstance.schema = modelInstance.xxschema
  }
  return modelInstance
}