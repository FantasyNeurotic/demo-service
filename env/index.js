const fs = require('fs')
const path = require('path')
const env = process.env
const NODE_ENV = env.NODE_ENV || 'development'
const envFile = env.ENV_FILE || path.join(process.cwd(), 'env', `${NODE_ENV}.env`)

if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, {
    encoding: 'utf8'
  })
  envContent.split('\n').forEach(line => {
    if (line) {
      env[line.split('=')[0]] = line.split('=')[1]
    }
  })
}

const envHandler = {
  get: function(target, name) {
    if (target[name] === undefined) {
      console.warn(`WARNING!!!! env ${name} not found`)
      return undefined
    }
    return target[name]
  }
}
console.log(NODE_ENV)
const envProxy = new Proxy(env, envHandler)
module.exports = envProxy
