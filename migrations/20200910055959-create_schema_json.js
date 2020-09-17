'use strict'
const Sequelize = require('sequelize')
module.exports = {
  up: (queryInterface) => {
    console.log('----')
    return queryInterface.createTable('schema_json', {
      id: {
        type: Sequelize.Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        comment: '主键ID'
      },
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
    return  queryInterface.dropTable('schema_json')
  }
}
