const Sequelize = require('sequelize')
const postgresConfig = require('../config').postgres
const postgresConnection = new Sequelize(postgresConfig)

module.exports = postgresConnection