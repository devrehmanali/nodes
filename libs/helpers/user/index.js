const User = require("../../../models/User");
const {
  HttpStatusCode,
  UserMessages,
  GenericMessages,
} = require("../../../constants");

exports.findUserByEmail = (email) => {
  return new Promise((resolve) => {
    try {
      User.findOne({ email: email }, (err, user) => {
        if (!err && user) {
          return resolve({
            code: HttpStatusCode.OK,
            message: UserMessages.USER_FOUND,
            user: user,
          });
        } else {
          resolve({
            code: HttpStatusCode.NOT_FOUND,
            message: UserMessages.USER_NOT_FOUND,
          });
        }
      });
    } catch (error) {
      return resolve({
        code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: GenericMessages.INTERNAL_SERVER_ERROR,
      });
    }
  });
};
exports.findUser = (obj) => {
  return new Promise((resolve) => {
    try {
      User.findOne(obj, (err, user) => {
        return resolve(user && !err ? user : null);
      });
    } catch (error) {
      return resolve(null);
    }
  });
};
exports.createUserAccount = (userObject, body = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const user = new User(userObject);
      if (body.password) user.setPassword(body.password);
      user.save((err, usr) => {
        if (err || !usr) {
          return resolve({
            code: HttpStatusCode.BAD_REQUEST,
            message: UserMessages.FAILED_TO_SAVE_USER,
          });
        }
        return resolve({
          code: HttpStatusCode.OK,
          message: UserMessages.USER_ACCOUNT_CREATED,
          data: usr,
        });
      });
    } catch (error) {
      return reject({
        code: HttpStatusCode.UNPROCESSABLE_ENTITY,
        message: UserMessages.FAILED_TO_SAVE_USER,
      });
    }
  });
};

exports.changeUserPassword = (user, password) => {
  return new Promise((resolve, reject) => {
    try {
      user.password = password;
      user.setPassword(user.password);
      user.save((err) => {
        if (err || !user) {
          return reject({
            code: HttpStatusCode.BAD_REQUEST,
            message: UserMessages.FAILED_TO_CHANGE_PASSWORD,
          });
        }
        return resolve({
          code: HttpStatusCode.OK,
          message: UserMessages.PASSWORD_CHANGED,
        });
      });
    } catch (error) {
      return reject({
        code: HttpStatusCode.UNPROCESSABLE_ENTITY,
        message: UserMessages.FAILED_TO_CHANGE_PASSWORD,
      });
    }
  });
};

exports.findUsersByRole = (role, parentId, object, skip = 0, limit = 100) => {
  return new Promise((resolve) => {
    try {
      const obj = {
        ...object,
        parentId: parentId,
        role:
          role === "super"
            ? {
                $in: ["admin"],
              }
            : role === "admin"
            ? {
                $in: ["user", "manager"],
              }
            : role === "user"
            ? { $in: ["user"] }
            : { $in: ["manager"] },
      };
      User.find(obj)
        .select("-password -salt")
        .sort({ _id: 1 })
        .skip(skip)
        .limit(limit)
        .exec(function (err, users) {
          return resolve(users ? users : []);
        });
    } catch (error) {
      return resolve([]);
    }
  });
};

exports.findCountDocuments = (role, parentId, object) => {
  return new Promise(async (resolve) => {
    try {
      const obj = {
        ...object,
        parentId: parentId,
        role:
          role === "super"
            ? {
                $in: ["admin"],
              }
            : role === "admin"
            ? {
                $in: ["user", "manager"],
              }
            : role === "user"
            ? { $in: ["user"] }
            : { $in: ["manager"] },
      };
      const count = await User.countDocuments(obj);

      return resolve(count);
    } catch (error) {
      return resolve(-1);
    }
  });
};

exports.updateUserAccount = (userObject, id) => {
  return new Promise((resolve, reject) => {
    try {
      User.findOne({ _id: id }, (err, user) => {
        if (user && !err) {
          user.firstName = userObject.firstName;
          user.lastName = userObject.lastName;

          user.email = userObject.email ? userObject.email : user.email;

          user.dob = userObject.dob ? userObject.dob : user.dob;
          user.mobile =
            userObject.contactNumber || userObject.contactNumber === ""
              ? userObject.contactNumber
              : user.mobile;

          user.walletAddress = userObject.walletAddress
            ? userObject.walletAddress
            : user.walletAddress;

          user.address =
            userObject.address || userObject.address === ""
              ? userObject.address
              : user.address;

          user.enabled =
            userObject.enabled !== undefined
              ? userObject.enabled
              : user.enabled;
          user.save((err) => {
            if (user && !err) {
              return resolve({
                code: HttpStatusCode.OK,
                message: UserMessages.USER_ACCOUNT_UPDATED,
                data: user,
              });
            } else {
              return resolve({
                code: HttpStatusCode.BAD_REQUEST,
                message: UserMessages.FAILED_TO_UPDATE_USER,
              });
            }
          });
        } else {
          return resolve({
            code: HttpStatusCode.NOT_FOUND,
            message: GenericMessages.ACCOUNT_NOT_FOUND,
          });
        }
      });
    } catch (error) {
      return resolve({
        code: HttpStatusCode.UNPROCESSABLE_ENTITY,
        message: UserMessages.FAILED_TO_UPDATE_USER,
      });
    }
  });
};
exports.enabledUserAccount = (role, id, enabled) => {
  return new Promise((resolve, reject) => {
    try {
      User.findOne({ _id: id }, (err, user) => {
        if (!user) {
          return reject({
            code: HttpStatusCode.NOT_FOUND,
            message: GenericMessages.ACCOUNT_NOT_FOUND,
          });
        }
        if (role === "admin" || role === "super") {
          user.enabled = enabled;
          user.save((err, usr) => {
            if (err && !usr) {
              return reject({
                code: HttpStatusCode.BAD_REQUEST,
                message: UserMessages.FAILED_TO_UPDATE_USER,
              });
            }
            return resolve({
              code: HttpStatusCode.OK,
              message: user.enabled
                ? UserMessages.ACCOUNT_UNSUSPENDED
                : UserMessages.ACCOUNT_SUSPENDED,
              data: user,
            });
          });
        } else {
          return reject({
            code: HttpStatusCode.BAD_REQUEST,
            message: UserMessages.ONLY_ADMIN,
          });
        }
      });
    } catch (error) {
      return reject({
        code: HttpStatusCode.UNPROCESSABLE_ENTITY,
        message: UserMessages.FAILED_TO_UPDATE_USER,
      });
    }
  });
};
exports.deleteUserAccount = (id) => {
  return new Promise((resolve, reject) => {
    try {
      User.findOne({ _id: id }, async (err, user) => {
        if (!user) {
          return reject({
            code: HttpStatusCode.NOT_FOUND,
            message: GenericMessages.ACCOUNT_NOT_FOUND,
          });
        }

        User.findByIdAndDelete({ _id: id }, async (err, doc) => {
          if (err || !doc) {
            return reject({
              code: HttpStatusCode.BAD_REQUEST,
              message: UserMessages.NOT_DELETED,
            });
          }
          return resolve({
            code: HttpStatusCode.OK,
            message: UserMessages.DELETED,
          });
        });
      });
    } catch (error) {
      return reject({
        code: HttpStatusCode.UNPROCESSABLE_ENTITY,
        message: UserMessages.NOT_DELETED,
      });
    }
  });
};
