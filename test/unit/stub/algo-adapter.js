const EventEmitter = require('events').EventEmitter
class AlgoAdapter extends EventEmitter {
  constructor(dicomConfig) {
    super()
  }
  consumer() {

  }
}

class Adapter {
  constructor(dicomConfig) {
    this.adapter = new AlgoAdapter(dicomConfig)
  }
  static getInstance(dicomConfig) {
    if (!this.instance) {
      return new Adapter(dicomConfig)
    }
    return this.instance
  }
}
module.exports =Adapter