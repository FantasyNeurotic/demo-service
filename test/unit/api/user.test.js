

describe ('User', function(){
  const Server = require('../../lib/server')
  const { expect } = require('chai')
  let server = Server.getInstance({ useStubs: true, stubsPath: __dirname + '/../stub'})

  it ('Invalid user', function(done){
    server.inject()
      .post('/api/user/sign_in')
      .set('Accept', 'application/json')
      .send({
        username: 'xxx',
        password: 'xxx'
      })
      .expect(401)
      .then(function (res) {
        expect(res.body.code).to.be.equal('401')
        expect(res.body.message).to.be.equal('Invalid user')
        done()
      })
      .catch(done)
  })

  it ('Invalid password', function(done){
    server.inject()
      .post('/api/user/sign_in')
      .set('Accept', 'application/json')
      .send({
        username: 'xx2',
        password: 'xx'
      })
      .expect(400)
      .then(function (res) {
        expect(res.body.code).to.be.equal('400')
        expect(res.body.message).to.be.equal('Invalid password')
        done()
      })
      .catch(done)
  })

  it ('success to sign in', function(done){
    server.inject()
      .post('/api/user/sign_in')
      .set('Accept', 'application/json')
      .send({
        username: 'xx3',
        password: 'xx'
      })
      .then(function (res) {
        console.log(res.body)
        expect(res.body.code).to.be.equal(200)
        expect(res.body.message).to.be.equal('success')
        expect(res.body.data.token).exist
        done()
      })
      .catch(console.log)
  })


  after(function() {
    server = null
  })
})