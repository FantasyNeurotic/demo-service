
const socketIO = require('socket.io')
class SocketIO extends socketIO {
  constructor(options) {
    super(options)
    this.__intialized = false
    /*
     * 注册一个鉴权中间件, 所有namespace的请求都会先经过这个中间件
     * 有两种方法鉴权
     * 1. 每次通过中间件，使用pv-token来判断此token是否有效
     * 2. 在connection的时候判断一次token，获取到用户信息之后保存到socket对象中，
     *    由于 socketIO 中每一个 socket 都会存在内存里，所以每一个 socket 对象
     *    被赋予的属性在下一次获取的时候仍然会存在，可以以此区分每一个人
     */
    this.use((socket, next) => {
      const token = socket.handshake.headers.token
      verifyToken(token, next)
    })

    /*
     * 访问每一个子路由都会先经过根路由，因此每一个connection都会经过这个回调
     */
    this.on('connection', function(socket) {
      console.info('connectedMain %s', socket.id)
    })
  }
  /**
   * [init description]
   * @desc 实例化http server 及 socketIO
   * @param  {Object} app [description]
   * @return {Object} server object
   */
  init(app) {
    const server = require('http').Server(app.callback())
    this.attach(server)
    return server
  }

  createNamespace(path) {
    const nsp = super.of(path)

    nsp.on('connection', function(socket) {
      console.info('connected %s', socket.id)
      /*
       * room 可能是数组，是数组的时候代表加入多个房间
       */
      socket.on('join', function(room, fn) {
        const permission = checkHasPermission()
        if (permission) {
          socket.join(room, () => {
            console.info(
              'id %s joined %s, now in %o',
              socket.id,
              room,
              Object.keys(socket.rooms)
            )
            if (fn && typeof fn === 'function') {
              fn({
                code: 200,
                message: 'success'
              })
            }
          })
        } else {
          socket.send({
            code: 403,
            message: 'not allowed'
          })
        }
      })

      socket.on('leave', function(room) {
        socket.leave(room)
        console.info(
          'id %s leaved %s, now in %o',
          socket.id,
          room,
          Object.keys(socket.rooms)
        )
      })

      socket.on('disconnect', () => {
        console.info('disconnected %s', socket.id)
      })
    })

    return nsp
  }
}

// TODO: Cyper: 做token验证 Sat Aug 11 15:45:44 2018
function verifyToken(token, next) {
  next()
}

// TODO: Cyper: 添加权限限制 Sat Aug 11 18:20:55 2018
function checkHasPermission() {
  return true
}

module.exports = new SocketIO({
  serveClient: false
})
