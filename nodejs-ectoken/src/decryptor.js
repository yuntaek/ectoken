const crypto = require('crypto')
const {LengthOfIV,LengthOfTag, Algorithm} = require('./constants.js')
const {getHashedKey} = require('./common.js')
module.exports = class Decryptor{
    constructor(token,key){
        this.token = Buffer.from(token, 'base64')
        this.key = key
        this.iv = Buffer.allocUnsafe(LengthOfIV)
        this.tag = Buffer.allocUnsafe(LengthOfTag)
        this.encrypted = null
        this.message = null
    }

    decrypt(){
        const decipher = crypto.createDecipheriv(Algorithm, getHashedKey(this.key), this.getIv())
        decipher.setAuthTag(this.getTag())
        this.message = decipher.update(this.getEncrypted(), null, 'utf8')
        this.message += decipher.final('utf8')
        return this.message
    }

    getIv(){
       this.token.copy(this.iv, 0, 0, LengthOfIV)
       return this.iv
    }

    getTag(){
       let offset = this.token.length - LengthOfTag
       this.token.copy(this.tag, 0, offset)
       return this.tag
    }

    getEncrypted(){
        let offset = LengthOfIV
        let length = this.token.length - (LengthOfIV + LengthOfTag)
        this.encrypted = Buffer.allocUnsafe(length)
        this.token.copy(this.encrypted, 0, offset, this.token.length - LengthOfTag)
        return this.encrypted
    }  
}
