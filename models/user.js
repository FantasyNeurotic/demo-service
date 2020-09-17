const  Sequelize = require('sequelize')
const BaseModel = require('./base')

module.exports = (sequelize) => {
  class UserModel extends BaseModel {
    static schema() {
      return {
        username: {
          type: Sequelize.TEXT,
          allowNull: false,
          comment: '账户名'
        },
        name: {
          type: Sequelize.TEXT,
          allowNull: true,
          comment: '用户名'
        },
        password: {
          type: Sequelize.TEXT,
          allowNull: false,
          comment: '密码'
        },
        tel: {
          type: Sequelize.TEXT,
          allowNull: true,
          comment: '联系方式'
        },
        email: {
          type: Sequelize.TEXT,
          allowNull: true,
          comment: '邮箱'
        },   
        partner: {
          type: Sequelize.JSONB,
          allowNull: true,
          comment: '合作方信息'
        }
      }
    }
  }
  UserModel.init(UserModel.schema(), {
    sequelize,
    modelName: 'User',
    tableName: 'user',
    comment: '用户表'
  })
  
  return UserModel
}