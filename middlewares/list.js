
const Sequelize = require('sequelize')

const allowOpList = [
  'eq', 'ne', 'gte', 'gt', 'lte', 'lt', 'not', 'is', 'in', 'notIn', 'like',
  'notLike', 'iLike', 'notILike', 'startsWith', 'endsWith', 'substring',
  'regexp', 'notRegexp', 'iRegexp', 'notIRegexp', 'between', 'notBetween',
  'overlap', 'contains', 'contained', 'and', 'or', 'any', 'all'
]
const list = ( modelAliasName) => {
  return async (ctx, next) => {
    const query = ctx.request.query
    let newQuery = {}
    if (query.where) {
      newQuery.where = JSON.parse(query.where)
    } else {
      newQuery.where = {}
    }
    const attributesMap = {}
    if (query.attributes) {
      newQuery.attributes = query.attributes.split(',').filter(attribute => {
        if (attribute.includes('.')) {
          const attributeArr = attribute.split('.')
          if (attributeArr.length == 2) {
            if (attributesMap[attributeArr[0]]) {
              attributesMap[attributeArr[0]].push(attributeArr[1])
            } else {
              attributesMap[attributeArr[0]] = [attributeArr[1]]
            }
          }
          return false
        } else {
          return true
        }
      })
    }
    if (query.include) {
      newQuery.include = query.include.split(',').map(o => {
        if (o.includes('.')) {
          return {
            association: o.split('.')[0],
            include: o.split('.')[1]
          }
        } else {
          return {
            association: o,
            attributes: attributesMap[o]
          }
        }
      })
    }

    if (query.order) {
      // ￥增强模式 暂时只提供中文按拼音排序 - 是desc  默认是asc
      newQuery.order = query.order.split(',').map(field => {
        let direction = 'asc'
        if (field.startsWith('-')) {
          field = field.substring(1)
          direction = 'desc'
        } else if(field.startsWith('￥')) {
          field = field.substring(1)
          if (field.startsWith('-')) {
            field = field.substring(1)
            direction = 'desc'
          }

          // GB18030是现在国家标准，兼容性高，兼容gbk
          return [Sequelize.fn('convert_to', Sequelize.col(modelAliasName ? (modelAliasName + '.' + field) : field), 'GB18030' ), direction]
        }

        return [field, direction]
      })
    }

    newQuery.limit = query.limit ? Math.min(parseInt(query.limit), 1000) : 12
    query.page = query.page ? parseInt(query.page) : 1
    newQuery.offset = query.offset ? parseInt(query.offset) : (query.page - 1) * newQuery.limit
    newQuery.paranoid = query.paranoid ? !!query.paranoid : true
    for (let key in newQuery.where) {
      const value = newQuery.where[key]
      const tmpWhere = {}
      if (value.constructor == Object) {
        for (let q in value) {
          if (q.startsWith('$') && allowOpList.includes(q.substring(1))) {
            const op = Sequelize.Op[q.substring(1)]
            tmpWhere[op] = value[q]
          }
        }
      }
      if (Reflect.ownKeys(tmpWhere).length) {
        newQuery.where[key] = tmpWhere
      }
    }
    ctx.state.query = newQuery
    return next()
  }
}
module.exports = list