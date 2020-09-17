const Sequelize = require('sequelize')


class BaseModel extends Sequelize.Model {
  static init(attributes, options = {}) {
    const _attributes = {}
    const _options = {}
    Object.assign(_attributes, {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        comment: '主键ID'
      }
    }, attributes)

    Object.assign(_options, {
      // Define the sequelize instance to attach to the new Model. Throw error if none is provided.
      // sequelize: sequelize,
      // Don't persist null values. This means that all columns with null values will not be saved
      omitNull: true,
      // Adds createdAt and updatedAt timestamps to the model.
      timestamps: true,
      // Calling destroy will not delete the model, but instead set a deletedAt timestamp if this is true. Needs timestamps=true to work
      paranoid: true,
      // Override the name of the createdAt attribute if a string is provided, or disable it if false. Timestamps must be true. Underscored field will be set with underscored setting.
      createdAt: 'created_at',
      // Override the name of the updatedAt attribute if a string is provided, or disable it if false. Timestamps must be true. Underscored field will be set with underscored setting.
      updatedAt: 'updated_at',
      // Override the name of the deletedAt attribute if a string is provided, or disable it if false. Timestamps must be true. Underscored field will be set with underscored setting.
      deletedAt: 'deleted_at',
      // If freezeTableName is true, sequelize will not try to alter the model name to get the table name. Otherwise, the model name will be pluralized
      freezeTableName: true
    }, options)
    return super.init(_attributes, _options)
  }
}

module.exports = BaseModel