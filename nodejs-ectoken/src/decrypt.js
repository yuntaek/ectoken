const crypto = require('crypto')
const {LengthOfIV,LengthOfTag, Algorithm} = require('./const.js')
const {getHashedKey} = require('./common.js')
module.exports = class Decryptor{
    constructor(token,key){
        this.token = Buffer.from(token,'base64')
        this.key = key
        this.iv = Buffer.allocUnsafe(LengthOfIV)
        this.tag = Buffer.allocUnsafe(LengthOfTag)
        this.encrypted = null
    }

    decrypt(){
        const decipher = crypto.createDecipheriv(Algorithm, getHashedKey(this.key), this.getIv())
        decipher.setAuthTag(this.getTag())
        this.decrypted = decipher.update(this.getEncrypted(),null,'utf8')
        this.decrypted += decipher.final('utf8')
        console.log('decrypted : ',this.decrypted)
    }

    getIv(){
       this.token.copy(this.iv,0,0,LengthOfIV)
       console.log('iv : ',this.iv)
       return this.iv
    }

    getTag(){
       let offset = this.token.length - LengthOfTag
       this.token.copy(this.tag,0,offset)
       return this.tag
    }

    getEncrypted(){
        let offset = LengthOfIV
        let length = this.token.length - (LengthOfIV+LengthOfTag)
        this.encrypted = Buffer.allocUnsafe(length)
        this.token.copy(this.encrypted,0,offset,this.token.length-LengthOfTag)
        console.log('encrypted : ',this.encrypted.toString('hex'))
        return this.encrypted
    }

    
}

let decryptor = new Decryptor('bNyYujTt7EXQwpQZ20HVIM7oJs4def+AHVafcdRW1Zvi2o+V1ZLBECXHjgkwPyR5REDiOgDnA7XuAMHGPA','somekey')
decryptor.decrypt()
