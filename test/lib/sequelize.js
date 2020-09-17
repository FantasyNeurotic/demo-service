const Sequelize  = require('sequelize-mock-support')
const DataTypes = require('sequelize-mock-support/src/data-types')
const data = require('../data')
const mock_data = require('./mock_data')
const Promise = require('bluebird')
const  dataMock = new Sequelize()
DataTypes(Sequelize)
Sequelize.Model.prototype.init = function(_attributes, _option) {
  if (_option.modelName && _option.modelName !== this.name) {
    Object.defineProperty(this, 'name', {value: _option.modelName})
    delete _option.modelName
  }
  this.Model = {}
  _option.autoQueryFallback = false
  this.options = _option
  // const queryinterface = _option.sequelize.queryinterface
  const modelName = this.name

  this.Instance = function(values, options) {
    return dataMock.define(this.name, mock_data(_attributes, {}), Object.assign({}, _option,
      {
        instanceMethods: {
          myTestFunc: function () {
            return 'Test User'
          },
          update: function() {  
          }
        }
      }
    ))
  }
  this.$query =  (result) => {
    const queryOptions = result.queryOptions['0']
    let modelData = data[modelName] && data[modelName].map((item) => mock_data(_attributes,item)) || []

    const test = this.Instance()

    modelData = modelData.map((md) => {
      return test.build(md || {})
    })

    test['$queryInterface'].$useHandler(function(query, queryOptions, done) {
      const isString = typeof(queryOptions[0]) ==='string'

      if (isString) {
        if (query === 'findByPk' ||query === 'findById' ) {
          const result = modelData.find((item) =>  {
            return item.id === queryOptions[0]
          })
          return Promise.resolve(result)
        }
      } else {
        const { where, limit, offset }= queryOptions[0]
        const filters = Object.keys(where)
        if (query === 'findAndCountAll') {
          const result = filters.length > 0 ? modelData.filter((item) =>  {
            let flag = true
            filters.forEach((f) => {
              if(item[f] !== where[f]) {
                flag = false
              }
            })
            return flag
          }): modelData
          return Promise.resolve({ count: result.length, rows: result})
        }
        if (query === 'findAll') {
          const result = filters.length > 0 ? modelData.filter((item) =>  {
            let flag = true
            filters.forEach((f) => {
              if(item[f] !== where[f]) {
                flag = false
              }
            })
            return flag
          }): modelData
          return Promise.resolve({ count: result.length, rows: result})
        }
        if (query === 'findOne') {
          const result = filters.length > 0 ? modelData.find((item) =>  {
            let flag = true
            filters.forEach((f) => {
              if(item[f] !== where[f]) {
                flag = false
              }
            })
            return flag
          }): modelData
          return Promise.resolve(result)
        }
      }
   
     

    })

    return test[result.query](queryOptions)
  }

  return this
}
Sequelize.Model.prototype.afterUpdate = function() {}
Sequelize.Model.prototype.afterCreate = function() {}
Sequelize.Model.prototype.afterDestroy = function() {}
Sequelize.Model.prototype.afterBulkCreate = function() {}
Sequelize.Model.prototype.save = function() { return Promise.resolve()}

Object.getOwnPropertyNames(Sequelize.Model.prototype).forEach((item) => {
  if(item !== 'constructor') {
    Sequelize.Model[item] = Sequelize.Model.prototype[item]
  }
})
Sequelize.prototype.Op = {
}
Sequelize.Op = {
}
Sequelize.DataTypes = {
}
Sequelize.literal  = Sequelize.prototype.literal

DataTypes(Sequelize.DataTypes)

module.exports = Sequelize