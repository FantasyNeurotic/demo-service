'use strict'

const fs = require('fs')

module.exports = class Stubs {
  constructor(stubs) {
    this.stubsPath = stubs
  }

  setStubsPath(path) {
    this.stubsPath = path
  }

  getStubs(path) {
    const stubs = {}

    if (path) {
      this.setStubsPath(path)
    }

    if (typeof this.stubsPath === 'object') {
      return this.stubsPath
    } else if (typeof this.stubsPath === 'string') {
      const stubFiles = fs.readdirSync(this.stubsPath)

      stubFiles.forEach((fileName) => {
        const stubName = fileName.replace(/\.[^\\.]+$/, '')
        const stub     = require(this.stubsPath + '/' + stubName)

        if (stub instanceof Object) {
          stub['@global'] = true
        } else {
          stub.prototype['@global'] = true
        }

        stubs[stubName] = stub
      })
    } else {
      throw new Error('Do not know how to handle this type of stubs')
    }

    return stubs
  }
}
