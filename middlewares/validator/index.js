const { validationResult } = require('express-validator');
const { HttpStatusCode } = require('../../constants');
const _ = require('lodash');
exports.checkValidation = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!_.isEmpty(validationErrors.errors)) {
    return res.status(HttpStatusCode.UNPROCESSABLE_ENTITY).json({
      code: HttpStatusCode.UNPROCESSABLE_ENTITY,
      message: validationErrors.array()
    });
  }
  next();
};
