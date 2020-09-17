describe('intergration test', function(){
  const Server = require('../../lib/server')
  const { expect } = require('chai')
  let server = new Server({ useStubs: false})
  let token = null
  before('login', async function() {
    this.timeout = 29000
    server.initDB()
    await server.inject()
      .post('/api/main/user/sign_in')
      .set('Accept', 'application/json')
      .send({
        username: 'xxx',
        password: 'xxx'
      })
      .then((res) => {
        token = res.body.data.token
      })
  })
  
  describe('algo record', function() {
    it ('respond with json', function(done){
      this.timeout = 29000
      server.inject()
        .get('/api/main/algo_record')
        .set('Accept', 'application/json')
        .set('pv-token', token)
        .then(function (res) {
          console.log(res.body)
          expect(res.body.code).to.be.equal(200)
          done()
        })
        .catch((err) => {
          console.log(err)
          done(err)
        })
    })
  })


  after(function() {
    server = null
  })
})