const crypto = require('crypto')
module.exports = class Common{
    static getHashedKey(key){
        let hashedKey =  crypto.createHash('sha256').update(key,'utf8').digest()
        console.log('hashed key :', hashedKey.toString('hex'))
        return hashedKey
     }
}