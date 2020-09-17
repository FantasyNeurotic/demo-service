
const postgres = require('./postgres')

module.exports = {
  'development': postgres,
  'test': postgres,
  'production': postgres
}
