const axios = require('axios');

exports.callAxios = config => {
  return new Promise((resolve, reject) => {
    try {
      axios(config)
        .then(resp => {
          resolve(resp);
        })
        .catch(error => {
          resolve(error.response);
        });
    } catch (error) {
      resolve(error);
    }
  });
};

exports.instance;
