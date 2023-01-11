const {
  findUserByEmail,
  changeUserPassword,
} = require("../../libs/helpers/user");
const {
  ForgotPasswordEmail,
  PasswordSuccessfullyResetEmail,
} = require("../../libs/shared/mailer");
const { decryptData } = require("../../libs/shared/encryption");
const {
  AuthMessages,
  HttpStatusCode,
  GenericMessages,
} = require("../../constants");

/**
 * @Route Post /auth
 * @dev User Login.
 */
exports.authLogin = (req) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        let user = await findUserByEmail(req.body.email);

        if (!user && user.code !== HttpStatusCode.OK) {
          return reject({
            code: HttpStatusCode.BAD_REQUEST,
            message: AuthMessages.INVALID_USERNAME_AND_PASSWORD,
          });
        }
        if (user.code === HttpStatusCode.OK && !user.user.enabled) {
          return reject({
            code: HttpStatusCode.BAD_REQUEST,
            message: AuthMessages.ACCOUNT_SUSPENDED,
          });
        }
        if (
          user.code === HttpStatusCode.OK &&
          user.user.validatePassword(req.body.password)
        ) {
          return resolve({
            code: HttpStatusCode.OK,
            data: user.user.toAuthJSON(),
            message: AuthMessages.LOGIN_SUCCESSFUL,
          });
        } else {
          return reject({
            code: HttpStatusCode.BAD_REQUEST,
            message: AuthMessages.INVALID_USERNAME_AND_PASSWORD,
          });
        }
      } catch (error) {
        return reject({
          code: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: GenericMessages.INTERNAL_SERVER_ERROR,
        });
      }
    })();
  });
};
/**
 * @Route Post /auth/forgetPassword
 * @dev User forget password.
 */
exports.forgetPassword = (req) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        let user = await findUserByEmail(req.body.email);
        if (user && user.code === HttpStatusCode.OK) {
          ForgotPasswordEmail(user.user)
            .then((res) => {
              return resolve({
                ...res,
                message: AuthMessages.RESET_PASSWORD_EMAIL_SENT,
              });
            })
            .catch((err) => {
              return reject({
                ...err,
                message: GenericMessages.EMAIL_SENDING_FAILED,
              });
            });
        } else {
          return reject({
            code: HttpStatusCode.BAD_REQUEST,
            message: GenericMessages.EMAIL_NOT_FOUND,
          });
        }
      } catch (error) {
        return reject({
          code: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: GenericMessages.INTERNAL_SERVER_ERROR,
        });
      }
    })();
  });
};
/**
 * @Route Post /auth/resetPassword
 * @dev User reset password.
 */
exports.resetPassword = (req) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        decryptData(req.body.token)
          .then(async (decoded) => {
            console.log(decoded);
            if (!decoded.id) {
              return reject({
                code: HttpStatusCode.BAD_REQUEST,
                message: AuthMessages.CONFIRMATION_TOKEN_INVALID,
              });
            }
            let user = await findUserByEmail(decoded.email);

            if (user && user.code !== HttpStatusCode.OK) {
              return reject({
                code: HttpStatusCode.BAD_REQUEST,
                message: AuthMessages.CONFIRMATION_TOKEN_INVALID,
              });
            } else {
              changeUserPassword(user.user, req.body.password)
                .then((u) => {
                  PasswordSuccessfullyResetEmail(user.user)
                    .then((res) => {
                      console.log(res);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                  return resolve({
                    ...u,
                  });
                })
                .catch((err) => {
                  return reject(err);
                });
            }
          })
          .catch(() => {
            return reject({
              code: HttpStatusCode.BAD_REQUEST,
              message: AuthMessages.CONFIRMATION_TOKEN_INVALID,
            });
          });
      } catch (error) {
        return reject({
          code: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: GenericMessages.INTERNAL_SERVER_ERROR,
        });
      }
    })();
  });
};
/**
 * @Route Post /auth/confirmation
 * @dev User confirmation.
 */
exports.confirmation = async (req) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        decryptData(req.body.token)
          .then(async (decoded) => {
            console.log(decoded);
            if (!decoded.id) {
              return reject({
                code: HttpStatusCode.BAD_REQUEST,
                message: AuthMessages.CONFIRMATION_TOKEN_INVALID,
              });
            }
            let user = await findUserByEmail(decoded.email);
            if (user && user.code !== HttpStatusCode.OK) {
              return reject({
                code: HttpStatusCode.BAD_REQUEST,
                message: AuthMessages.CONFIRMATION_TOKEN_INVALID,
              });
            } else {
              changeUserPassword(user.user, req.body.password)
                .then((u) => {
                  return resolve({
                    ...u,
                    message: AuthMessages.ACCOUNT_VERIFIED,
                  });
                })
                .catch((err) => {
                  return reject({
                    ...err,
                    message: AuthMessages.ACCOUNT_NOT_VERIFIED,
                  });
                });
            }
          })
          .catch(() => {
            return reject({
              code: HttpStatusCode.BAD_REQUEST,
              message: AuthMessages.CONFIRMATION_TOKEN_INVALID,
            });
          });
      } catch (error) {
        return reject({
          code: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: GenericMessages.INTERNAL_SERVER_ERROR,
        });
      }
    })();
  });
};
