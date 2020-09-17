const mkdirp = require('mkdirp')
const koaBody = require('koa-body')
const config = require('../config')

//保证上传目录存在
mkdirp.sync(config.formidable.uploadDir, {
  mode: 0o744
})
//转换post数据为json，file
module.exports = koaBody({
  multipart: true,
  jsonLimit: config.formidable.jsonLimit,
  formLimit: config.formidable.formLimit,
  textLimit: config.formidable.textLimit,
  formidable: config.formidable
})