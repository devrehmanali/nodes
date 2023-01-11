const { check } = require('express-validator');
const { ValidationMessages } = require('../../../constants');
const mongoose = require('mongoose');
const emailValidator = check('email')
  .trim()
  .toLowerCase()
  .isEmail()
  .withMessage(ValidationMessages.EMAIL_VALIDATE)
  .normalizeEmail()
  .notEmpty()
  .withMessage(ValidationMessages.EMAIL_REQUIRED);
const firstNameValidator = check('firstName')
  .trim()
  .escape()
  .notEmpty()
  .withMessage(ValidationMessages.FIRST_NAME_REQUIRED)
  .isLength({ max: 50 })
  .withMessage(ValidationMessages.MAX_CHARS_REQUIRED);
const lastNameValidator = check('lastName')
  .trim()
  .escape()
  .notEmpty()
  .withMessage(ValidationMessages.LAST_NAME_REQUIRED)
  .isLength({ max: 50 })
  .withMessage(ValidationMessages.MAX_CHARS_REQUIRED);
const enabledOptionalValidator = check('enabled')
  .optional()
  .isBoolean()
  .withMessage(ValidationMessages.ENABLED_NOT_VALID);
const enabledValidator = check('enabled')
  .notEmpty()
  .withMessage(ValidationMessages.ENABLED_REQUIRED)
  .isBoolean()
  .withMessage(ValidationMessages.ENABLED_NOT_VALID);
/**
 * Create admin fields
 */
exports.createAdminValidator = [
  emailValidator,
  firstNameValidator,
  lastNameValidator,
  enabledOptionalValidator
];
/**
 * Update admin fields
 */
exports.updateAdminValidator = [
  check('id')
    .notEmpty()
    .withMessage(ValidationMessages.Id_REQUIRED)
    .custom((value, { req }) => {
      if (!mongoose.Types.ObjectId.isValid(req.params.id))
        throw new Error(ValidationMessages.Id_NOT_VALID);
      return true;
    }),
  emailValidator,
  firstNameValidator,
  lastNameValidator
];

/**
 * Enabled admin fields
 */
exports.enabledAdminValidator = [
  check('id')
    .notEmpty()
    .withMessage(ValidationMessages.Id_REQUIRED)
    .custom((value, { req }) => {
      if (!mongoose.Types.ObjectId.isValid(req.body.id))
        throw new Error(ValidationMessages.Id_NOT_VALID);
      return true;
    }),
  enabledValidator
];

/**
 * Assign Role
 */
exports.assignManagerRole = [
  check('title').notEmpty().withMessage('Title required')
];
