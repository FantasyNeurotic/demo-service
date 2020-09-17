const proxyquire =  require('proxyquire')
  , assert     =  require('assert')
  , pathStub   =  { }

// when no overrides are specified, path.extname behaves normally
const foo = proxyquire('./foo', { 'path': pathStub })
assert.strictEqual(foo.extnameAllCaps('file.txt'), '.TXT')

// override path.extname
pathStub.extname = function (file) { return 'Exterminate, exterminate the ' + file }


describe ('util unit test', function() {
  it ('path.extname now behaves as we told it to', function() {
    assert.strictEqual(foo.extnameAllCaps('file.txt'), 'EXTERMINATE, EXTERMINATE THE FILE.TXT')
  })
  
})