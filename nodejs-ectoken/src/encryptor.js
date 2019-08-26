const crypto = require('crypto')
const {LengthOfIV,Algorithm} = require('./constants.js')
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
        this.tag = cipher.getAuthTag().toString('hex')
        return this.getToken()
    }

    _genIv(){
        this.iv = crypto.randomBytes(LengthOfIV)
        return this.iv
    }

    getIv(){
        if(!this.iv){
            return this._genIv()
        }
        return this.iv
    }
    
    getTag(){
        return this.tag
    }

    _genToken(){
        let rawToken = this.iv.toString('hex')+this.encrypted+this.tag
        rawToken = Buffer.from(rawToken,'hex')
        this.token = rawToken.toString('base64').replace(/=/g,'')
        return this.token
    }

    getToken(){
        if(!this.token){
            return this._genToken()
        }
        return this.token
    }
}
