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

const firstNameValidator = check("firstName")
  .trim()
  .toLowerCase()
  .notEmpty()
  .withMessage("First name is required!");

const lastNameValidator = check("lastName")
  .trim()
  .toLowerCase()
  .notEmpty()
  .withMessage("Last name is required!");

const mobileValidator = check("contact")
  .trim()
  .notEmpty()
  .withMessage("Contact is required!")
  .isNumeric()
  .withMessage("Only numbers are allowed!");

const passwordValidator = check("password")
  .trim()
  .escape()
  .notEmpty()
  .withMessage(ValidationMessages.PASSWORD_REQUIRED);

const roleValidator = check("role")
  .trim()
  .toLowerCase()
  .notEmpty()
  .withMessage("User role is required!");

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

exports.registerValidator = [
  firstNameValidator,
  lastNameValidator,
  emailValidator,
  mobileValidator,
  passwordValidator,
  roleValidator,
];

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
