const  Sequelize = require('sequelize')
const BaseModel = require('./base')

module.exports = (sequelize) => {
  class UserModel extends BaseModel {
    static schema() {
      return {
        api_id: {
          type: Sequelize.TEXT,
          allowNull: false,
          comment: 'api的id'
        },
        type: {
          type: Sequelize.SMALLINT,
          defaultValue: 1,
          allowNull: false,
          comment: '区分 1.根据api默认生成， 2.根据业务生成'
        },
        schema_json: {
          type: Sequelize.JSON,
          allowNull: false,
          comment: 'schema json'
        }
      }
    }
  }
  UserModel.init(UserModel.schema(), {
    sequelize,
    modelName: 'SchemaJson',
    tableName: 'schema_json',
    comment: 'schema json'
  })
  
  return UserModel
}