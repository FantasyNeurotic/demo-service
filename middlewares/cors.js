const cors = require('koa-cors')
module.exports = cors({
  credentials: true,
  origin: true
})