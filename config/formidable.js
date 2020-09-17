const env = require('../env')
const path = require('path')

module.exports = {
  uploadDir: env.FORMIDABLE_UPLOAD_DIR || path.resolve('uploads', 'tmp'),
  jsonLimit: env.FORMIDABLE_JSON_LIMIT || 5 * 1024 * 1024,
  formLimit: env.FORMIDABLE_FORM_LIMIT || 5 * 1024 * 1024,
  textLimit: env.FORMIDABLE_TEXT_LIMIT || 5 * 1024 * 1024,
  maxFileSize: env.FORMIDABLE_MAX_FILE_SIZE ? parseInt(env.FORMIDABLE_MAX_FILE_SIZE) : 20 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
  keepExtensions: true,
  hash: 'sha1'
}