const jwt = require('jsonwebtoken');
const { private_key, public_key } = require('../../config/jwt');

const signOptions = {
  issuer: 'Kinectro',
  expiresIn: '90d',
  algorithm: 'RS512'
};
const verifyOptions = {
  issuer: 'Kinectro',
  expiresIn: '90d',
  algorithm: ['RS512']
};
module.exports = {
  sign: payload => {
    // Token signing options
    return jwt.sign(payload, private_key, signOptions);
  },
  verify: token => {
    try {
      return jwt.verify(token, public_key, verifyOptions);
    } catch (err) {
      return false;
    }
  },
  decode: token => {
    return jwt.decode(token, { complete: true });
  }
};
