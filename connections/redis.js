const Redis = require('ioredis')
const redisConfig = require('../config').redis

const redisConnection = (() => {
  let url = `redis://${redisConfig.host}:${redisConfig.port}/${redisConfig.database}`
  const redis = new Redis(url, {
    showFriendlyErrorStack: true,
    maxRetriesPerRequest: 3,
    password: redisConfig.auth && redisConfig.auth.pwd,
    retryStrategy(times) {
      var delay = Math.min(times * 1000, 10000)
      return delay
    }
  })
  redis.on('connect', () => {
    console.info(`redisConnection success: redis://${redisConfig.auth?':authpassword@':''}${redisConfig.host}:${redisConfig.port}/${redisConfig.database}`)
  })
  redis.on('error', e => {
  })
  return redis
})()
module.exports = redisConnection