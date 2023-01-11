const { check } = require("express-validator");
const { ValidationMessages } = require("../../constants");
const emailValidator = check("email")
  .trim()
  .toLowerCase()
  .isEmail()
  .withMessage(ValidationMessages.EMAIL_VALIDATE)
  .normalizeEmail()
  .notEmpty()
  .withMessage(ValidationMessages.EMAIL_REQUIRED);

const passwordValidator = check("password")
  .trim()
  .escape()
  .notEmpty()
  .withMessage(ValidationMessages.PASSWORD_REQUIRED);

const validateTokenAndSetPasswordValiditor = [
  check("token")
    .notEmpty()
    .withMessage(ValidationMessages.CONFIRMATION_TOKEN_REQUIRED),
  check("password")
    .trim()
    .escape()
    .notEmpty()
    .withMessage(ValidationMessages.PASSWORD_REQUIRED)
    .isLength({ min: 8, max: 40 })
    .withMessage(ValidationMessages.PASSWORD_LENGTH),
  check("confirmPassword")
    .trim()
    .escape()
    .notEmpty()
    .withMessage(ValidationMessages.CONFIRM_PASSWORD_REQUIRED)
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(ValidationMessages.PASSWORD_NOT_MATCHED);
      } else {
        return value;
      }
    }),
];

/**
 * Login fields
 */
exports.loginValidator = [emailValidator, passwordValidator];

/**
 * Forget passward fields
 */
exports.forgetValidator = [emailValidator];
/**
 * Reset passward fields
 */
exports.resetValidator = validateTokenAndSetPasswordValiditor;
/**
 * Confirm User form fields
 */
exports.confirmUserValidator = validateTokenAndSetPasswordValiditor;
