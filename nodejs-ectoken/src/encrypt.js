const crypto = require('crypto')
const {LengthOfIV,Algorithm} = require('./const.js')
const {getHashedKey} = require('./common.js')
module.exports = class Encryptor{
    constructor(message,key){
        this.message = message
        this.key = key
        this.iv = null
        this.tag = null
        this.encrypted = null
        this.token = null
    }
    getHashedKey(){
       let hashedKey =  crypto.createHash('sha256').update(this.key,'utf8').digest()
       console.log('hashed key :', hashedKey.toString('hex'))
       return hashedKey
    }

    encrypt(){
        const cipher = crypto.createCipheriv(Algorithm, getHashedKey(this.key), this.getIv())
        this.encrypted = cipher.update(this.message,'utf8','hex')
        this.encrypted += cipher.final('hex')
        console.log('generated encrypted : ',this.encrypted)
        this.tag = cipher.getAuthTag().toString('hex')
        console.log('generated tag : ', this.tag)
    }

    _genIv(){
        this.iv = crypto.randomBytes(LengthOfIV)
        console.log('generated iv : ',this.iv.toString('hex'))
        return this.iv
    }

    getIv(){
        if(!this.iv){
            return this._genIv()
        }
        console.log('get iv : ',this.iv.toString('hex'))
        return this.iv
    }
    
    getTag(){
        return this.tag
    }

    _genToken(){
        let rawToken = this.iv.toString('hex')+this.encrypted+this.tag
        rawToken = Buffer.from(rawToken,'hex')
        console.log('rawToken : ', rawToken.toString('base64'))
        this.token = rawToken.toString('base64').replace(/=/g,'')
        console.log('generated token : ',this.token)
        return this.token
    }

    getToken(){
        if(!this.token){
            return this._genToken()
        }
        console.log('get token : ',this.token)
        return this.token
    }
}
