
const bcrypt = require('bcryptjs')

module.exports = [
  { username: 'xx1', password: 'xx'},
  { username: 'xx2', password: 'xx'},
  { username: 'xx3', password: bcrypt.hashSync('xx', bcrypt.genSaltSync(10))},
  { id: 'f10126d5-6f98-4477-baea-97bdb5a8a3b5', username: 'loginuser', password: bcrypt.hashSync('xx', bcrypt.genSaltSync(10))}
]