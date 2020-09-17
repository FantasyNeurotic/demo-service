const Joi = require('koa-joi-router-support').Joi

const anonymous = {
  '200-599': {
    body: Joi.object().keys({
      code: Joi.number().required(),
      message: Joi.string(),
      data: Joi.any()
    })
  }
}
//获取的参数验证
const get = {
  '200-599': {
    body: Joi.object().keys({
      code: Joi.number().required(),
      message: Joi.string(),
      data: Joi.object()
    })
  }
}
//列表的参数验证
const list = {
  '200-599': {
    body: Joi.object().keys({
      code: Joi.number().required(),
      message: Joi.string(),
      data: Joi.object().keys({
        count: Joi.number().required(),
        rows: Joi.array().required().items(Joi.object())
      })
    })
  }
}
//创建的参数验证
const create = {
  '200-599': {
    body: Joi.object().keys({
      code: Joi.number(),
      message: Joi.string(),
      data: Joi.object().keys({
        id: Joi.string().uuid({ version: 'uuidv4' }),
        created_at: Joi.date().iso()
      })
    })
  }
}
//更新的参数验证
const update = {
  '200-599': {
    body: Joi.object().keys({
      code: Joi.number().required(),
      message: Joi.string(),
      data: Joi.object().keys({
        updated_at: Joi.date().iso()
      })
    })
  }
}
//删除的参数验证
const remove = {
  '200-599': {
    body: Joi.object().keys({
      code: Joi.number().required(),
      message: Joi.string(),
      data: Joi.object().keys({
        deleted_at: Joi.date().iso()
      })
    })
  }
}
module.exports = {
  output: {
    anonymous,
    get,
    list,
    create,
    update,
    remove
  }
}