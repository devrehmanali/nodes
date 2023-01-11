const fs = require('fs')
const path = require('path')
var private_key = fs.readFileSync(path.resolve('config/jwt/private.key'))
var public_key = fs.readFileSync(path.resolve('config/jwt/public.key'))
module.exports = {
  public_key: public_key,
  private_key: private_key
}
