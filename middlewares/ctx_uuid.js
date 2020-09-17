const uuid = require('uuid')
module.exports = async function(ctx, next) {
  ctx.uuid = uuid.v4()
  return next()
}
