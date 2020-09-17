const bcrypt = require('bcryptjs')

const password =(password) =>  {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
module.exports = {
  password,
  bcrypt
}
