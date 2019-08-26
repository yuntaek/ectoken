const key = 'someKey'
const message = 'ec_expire=1257642471&ec_secure=33'
const Encryptor = require('../src/encryptor.js')
const Decryptor = require('../src/decryptor.js')
const chai = require('chai')
const expect = chai.expect

describe('Test ectoken',function() {
    let encryptor = new Encryptor(message, key)
    encryptor.encrypt()
    let decryptor
    const token = Buffer.from(encryptor.token,'base64')
    decryptor = new Decryptor(token,key)
    it('should be decrypted',function(){
          decryptor.decrypt()
    })
    const tag = encryptor.tag.toString('hex')
    it(`should have a tag \'${tag}\'`,function(){
       
        expect(decryptor.tag.toString('hex')).to.equal(tag)
    })
    const iv = encryptor.iv.toString('hex')
    it(`should have a iv \'${iv.toString('hex')}\'`,function(){
        expect(decryptor.iv.toString('hex')).to.equal(iv)
    })
    const encrypted = encryptor.encrypted.toString('hex')
    it(`should have encrypted \'${encrypted}\'`,function(){
        expect(decryptor.encrypted.toString('hex')).to.equal(encrypted)
    })
    it(`should have decrypted message \'${message}\'`,function(){
        expect(decryptor.message).to.equal(message)
    })
})