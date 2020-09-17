'use strict'
const Sequelize = require('sequelize')
module.exports = {
  up: (queryInterface) => {
    return queryInterface.createTable('user', {
      id: {
        type: Sequelize.Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        comment: '主键ID'
      },
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
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: '创建日期'
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    })
  },

  down: (queryInterface) => {
    return  queryInterface.dropTable('user')
  }
}
