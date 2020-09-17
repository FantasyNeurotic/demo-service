const Sequelize = require('sequelize')
const postgresConnection = require('../connections').postgres
const fs = require('fs')

const db = {
  sequelize: postgresConnection,
  Sequelize: Sequelize
}


fs.readdirSync(__dirname).filter(filename => {
  // 不加载index.js
  return filename.endsWith('.js') && !['index.js', 'base.js'].includes(filename)
}).forEach(filename => {
  const filePath = `${__dirname}/${filename}`
  const model = postgresConnection.import(filePath)
  db[model.name] = model
})

Object.keys(db).forEach(async modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

module.exports = db