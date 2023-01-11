// const cryptoJS = require("crypto-js");
// const hmacSHA256 = require("crypto-js/hmac-sha256");
// const HEX = require("crypto-js/enc-hex");
// // secret key generate 32 bytes of random data
// const Securitykey = cryptoJS.enc.Hex.parse(process.env.ENCRYPT_SECRET);
// exports.createSignature = (data, wallet) => {
//   return new Promise((resolve) => {
//     try {
//       const body = JSON.stringify(data);
//       const signature = HEX.stringify(hmacSHA256(body, wallet));
//       return resolve(signature);
//     } catch (err) {
//       console.log(err);
//       resolve(null);
//     }
//   });
// };

// exports.encryptData = (data) => {
//   return new Promise((resolve, reject) => {
//     try {
//       const value = JSON.stringify(data);
//       let cipher = cryptoJS.AES.encrypt(value, Securitykey, {
//         mode: cryptoJS.mode.ECB,
//         padding: cryptoJS.pad.Pkcs7,
//       });
//       var encryptedDataHexStr = cipher.toString(cryptoJS.format.Hex);
//       return resolve(encryptedDataHexStr);
//     } catch (err) {
//       console.log(err);
//       reject(null);
//     }
//   });
// };

// exports.decryptData = (data) => {
//   return new Promise((resolve, reject) => {
//     try {
//       var encryptedHex = cryptoJS.enc.Hex.parse(data);
//       var encryptedBase64 = cryptoJS.enc.Base64.stringify(encryptedHex);
//       const decipher = cryptoJS.AES.decrypt(encryptedBase64, Securitykey, {
//         mode: cryptoJS.mode.ECB,
//         padding: cryptoJS.pad.Pkcs7,
//       });
//       let decryptedData = decipher.toString(cryptoJS.enc.Utf8);
//       return resolve(JSON.parse(decryptedData));
//     } catch (err) {
//       console.log(err);
//       reject(null);
//     }
//   });
// };

// exports.compareHmacHash = (apiKey, body, hash) => {
//   try {
//     const signature = HEX.stringify(hmacSHA256(JSON.stringify(body), apiKey));
//     return signature === hash;
//   } catch (err) {
//     return false;
//   }
// };
// exports.createHmacHash = () => {
//   return new Promise((resolve, reject) => {
//     try {
//       const apiKey =
//         "1E6HC1XQWJSMNODOEKH0ZZ8NGCV4U2UU5JOX475FV2JS3W2TX2VPMOC0IBVFOSVXXSEUP9GZZ1Y0FNK+JCQIVA==";
//       const body = JSON.stringify({
//         // userId: 'b373d78288d0aae78900d130fe521ad8a9be49232',
//         // enabled: true,
//         value: 0.01,
//         timestamp: 1652764424,
//         // accountAddress: '0xc3ae400a1a8ad91d89ec4e85ce4b37af306ac4c3'
//         // tokenAddress: '0x64544969ed7EBf5f083679233325356EbE738930'
//       });
//       const signature = HEX.stringify(hmacSHA256(body, apiKey));
//       return resolve(signature);
//     } catch (err) {
//       reject(false);
//     }
//   });
// };
