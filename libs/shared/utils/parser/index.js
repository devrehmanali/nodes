const { OFFSET_LIMIT } = require('../../../../constants');
exports.getFullName = user => {
  return user ? parseNull(user.firstName) + ' ' + parseNull(user.lastName) : '';
};
const parseNull = val => {
  return val ? val : '';
};
exports.checkNullString = val => {
  return val ? val : '';
};
exports.toLowerCase = val => {
  return val ? val.toLowerCase() : '';
};
exports.toUpperCase = val => {
  return val ? val.toUpperCase() : '';
};
exports.getPaginationLimit = req => {
  // const { page, offset } = req.query;
  const { page, offset } = req.body.variables || req.query;
  const limit = offset ? parseInt(offset) : OFFSET_LIMIT;
  const pageNo = page ? page : 1;
  const skip = page
    ? parseInt(page) === 1
      ? 0
      : parseInt(page - 1) * limit
    : 0;
  return [skip, limit, pageNo];
};

exports.parseError = error => {
  let err = 'Something went wrong, Please try again.';
  if (error && error.response && error.response.data) {
    return (err = error.response.data);
  } else {
    return err;
  }
};

exports.parseErrorMessage = errorMessage => {
  let toReturn = 'Error occured';
  if (errorMessage && Array.isArray(errorMessage)) {
    toReturn = errorMessage[0].msg;
  } else if (errorMessage) {
    toReturn = errorMessage;
  }

  return toReturn;
};
