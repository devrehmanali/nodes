const {
  findUserByEmail,
  findUser,
  createUserAccount,
  updateUserAccount,
  enabledUserAccount,
  findUsersByRole,
  findCountDocuments,
  deleteUserAccount,
} = require("../../../libs/helpers/user");
const { SendInvitationEmail } = require("../../../libs/shared/mailer");
const {
  HttpStatusCode,
  GenericMessages,
  AdminMessages,
  UserMessages,
} = require("../../../constants");
const {
  getPaginationLimit,
  checkNullString,
} = require("../../../libs/shared/utils/parser");

const Role = require("../../../models/Role");

const { createRole } = require("../../../libs/shared/role");
const User = require("../../../models/User");
const { callAxios } = require("../../../libs/shared/axios");

const { capitalize } = require("lodash");
const _ = require("lodash");

/**
 * @Route Get /admin/superAdmin
 * @dev Creates Super admin with the predefined credentials.
 */
exports.createSuperAdmin = async () => {
  return new Promise((resolve, reject) => {
    try {
      findUserByEmail(process.env.ADMIN_EMAIL).then((user) => {
        if (user && user.code === HttpStatusCode.OK) {
          return resolve({
            code: HttpStatusCode.CREATED,
            message: AdminMessages.ALREADY_CREATED,
          });
        }
        createUserAccount(
          {
            firstName: "Broker",
            lastName: "Admin",
            email: process.env.ADMIN_EMAIL,
            role: "super",
          },
          {
            password: process.env.ADMIN_PASSWORD,
          }
        )
          .then(async (res) => {
            const roleRes = new Role({
              title: "super",
              userId: res.data._id,
              parentId: null,
            });
            await roleRes.save();
            if (roleRes) {
              return resolve({
                code: res.code,
                message: AdminMessages.ACCOUNT_CREATED,
              });
            } else {
              return resolve({
                code: HttpStatusCode.BAD_REQUEST,
                message: AdminMessages.ADMIN_ACCOUNT_NOT_CREATED,
              });
            }
          })
          .catch((err) => {
            return reject({
              ...err,
              message: AdminMessages.ADMIN_ACCOUNT_NOT_CREATED,
            });
          });
      });
    } catch (error) {
      return reject({
        code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: GenericMessages.INTERNAL_SERVER_ERROR,
      });
    }
  });
};

/**
 * @Route Get /admin/admins
 * @dev Get all sub-users of current user(super or admin) logged in
 */
exports.getUsers = async (req) => {
  return new Promise((resolve, reject) => {
    try {
      const [skip, limit, pageNo] = getPaginationLimit(req);
      let role = req.query.role ? req.query.role : req.jwt.role;
      let username = _.split(req.query.userName ? req.query.userName : "", " ");
      let obj = {};

      if (username[0]) {
        obj = {
          ...obj,
          firstName: { $regex: new RegExp(`${username[0]}`, "i") },
        };
      }
      if (username[1]) {
        obj = {
          ...obj,
          lastName: { $regex: new RegExp(`${username[1]}`, "i") },
        };
      }
      if (req.query.email) {
        obj = {
          ...obj,
          email: { $regex: new RegExp(`${req.query.email}`, "i") },
        };
      }
      if (req.query.mobile) {
        obj = {
          ...obj,
          mobile: { $regex: new RegExp(`${req.query.mobile}`, "i") },
        };
      }

      findUsersByRole(role, req.jwt.id, obj, skip, limit)
        .then(async (users) => {
          const count = await findCountDocuments(role, req.jwt.id, obj);

          return resolve({
            code: HttpStatusCode.OK,
            data: users,
            message: AdminMessages.USER_FETCHED,
            count: Math.ceil(count / limit),
            current: pageNo,
            total: count,
          });
        })
        .catch((err) => {
          return resolve({
            code: HttpStatusCode.BAD_REQUEST,
            message: AdminMessages.USER_NOT_FETCHED,
          });
        });
    } catch (error) {
      return reject({
        code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: GenericMessages.INTERNAL_SERVER_ERROR,
      });
    }
  });
};

/**
 * @Route POST /admin/admins
 * @dev Create a user based on current user logged in
 *      e.g. if role of authenticated user is super
 *      then this controller will only create admin
 *      and if role is admin(means broker) then this
 *      controller will only create user of role user
 */
exports.createAdmin = async (req) => {
  return new Promise((resolve, reject) => {
    try {
      (async () => {
        findUserByEmail(req.body.email).then((user) => {
          let userRole = req.jwt.role;
          let roleToCreate = req.body.role;
          roleToCreate = roleToCreate
            ? roleToCreate
            : userRole === "super"
            ? "admin"
            : userRole === "admin"
            ? "user"
            : "user";

          if (user && user.code === HttpStatusCode.OK) {
            return resolve({
              code: HttpStatusCode.UNPROCESSABLE_ENTITY,
              message: AdminMessages.USER_ALREADY_CREATED,
            });
          }

          createUserAccount(
            {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              role: roleToCreate,
              mobile: checkNullString(req.body.mobile),
              walletAddress: checkNullString(req.body.walletAddress),
              enabled: req.body.enabled || true,
              parentId: req.jwt.id,
            },
            req.body
          )
            .then(async (res) => {
              const roleRes = await createRole(req, roleToCreate, res.data._id);

              if (roleRes && roleRes.code === HttpStatusCode.OK) {
                const emailRes = await SendInvitationEmail(res.data);

                return resolve({
                  ...res,
                  data: res.data.toProfile(),
                  message:
                    capitalize(roleToCreate) + AdminMessages.ACCOUNT_CREATED,
                });
              }

              await deleteUserAccount(res.data.id);

              return resolve({
                ...res,
                message:
                  roleToCreate === "admin"
                    ? AdminMessages.ADMIN_ACCOUNT_NOT_CREATED
                    : AdminMessages.USER_ACCOUNT_NOT_CREATED,
              });
            })
            .catch((err) => {
              return reject({
                ...err,
                message:
                  roleToCreate === "admin"
                    ? AdminMessages.ADMIN_ACCOUNT_NOT_CREATED
                    : AdminMessages.USER_ACCOUNT_NOT_CREATED,
              });
            });
        });
      })();
    } catch (error) {
      return reject({
        code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: GenericMessages.INTERNAL_SERVER_ERROR,
      });
    }
  });
};

/**
 * @Route PUT /admin/admins/:id
 * @dev Update user based on role
 */
exports.updateAdmin = async (req) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const { id } = req.params;
        const user = await findUser({ _id: id });

        if (user) {
          if (req.body.email !== user.email) {
            const newUser = await findUserByEmail(req.body.email);
            if (newUser && newUser.code !== HttpStatusCode.OK) {
              updateUserAccount(req.body, id)
                .then((res) => {
                  return resolve({
                    ...res,
                    data: res.data.toProfile(),
                    message: AdminMessages.ACCOUNT_UPDATED,
                  });
                })
                .catch((err) => {
                  return reject({
                    ...err,
                    message: AdminMessages.USER_ACCOUNT_NOT_UPDATED,
                  });
                });
            } else {
              return reject({
                code: HttpStatusCode.UNPROCESSABLE_ENTITY,
                message: AdminMessages.EMAIL_EXIST,
              });
            }
          } else {
            return reject({
              code: HttpStatusCode.UNPROCESSABLE_ENTITY,
              message: AdminMessages.EMAIL_EXIST,
            });
          }
        } else {
          return reject({
            code: HttpStatusCode.NOT_FOUND,
            message: GenericMessages.ACCOUNT_NOT_FOUND,
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
 * @Route POST /admin/admins/enabled
 * @dev Enable or disable user
 */
exports.enabledAdmin = async (req) => {
  return new Promise((resolve, reject) => {
    try {
      enabledUserAccount(req.jwt.role, req.body.id, req.body.enabled)
        .then((res) => {
          return resolve({
            ...res,
            data: res.data.toProfile(),
          });
        })
        .catch((err) => {
          return reject({
            ...err,
            message: AdminMessages.ACCOUNT_UPDATED,
          });
        });
    } catch (error) {
      return reject({
        code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: GenericMessages.INTERNAL_SERVER_ERROR,
      });
    }
  });
};

/**
 * @Route Get /admin/admins/:id/resentInvitation
 * @dev Resent Invitation email to admin
 */
exports.resentInvitation = async (req) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const { id } = req.params;
        const user = await findUser({ _id: id });
        if (!user) {
          return reject({
            code: HttpStatusCode.NOT_FOUND,
            message: GenericMessages.ACCOUNT_NOT_FOUND,
          });
        }
        SendInvitationEmail(user)
          .then((res) => {
            return resolve({
              ...res,
              message: AdminMessages.RESENT_INVITATION,
              code: HttpStatusCode.OK,
            });
          })
          .catch((err) => {
            console.log(err);
            return reject({
              ...err,
              message: GenericMessages.EMAIL_FAILED,
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
 * @Route PUT /admin/admins/assignRole/:id
 * @dev Assign user as manager role to give edit rights
 */
exports.assignAsManagerRole = (req) => {
  return new Promise((resolve) => {
    try {
      (async () => {
        const role = await Role.findOne({
          parentId: req.jwt.id,
          userId: req.params.id,
        });

        const user = await User.findOne({ _id: req.params.id });

        if (role && user) {
          if (role.title == "manager" && req.body.title == "manager") {
            return resolve({
              code: HttpStatusCode.BAD_REQUEST,
              message: UserMessages.ALREADY_MANAGER,
            });
          } else if (req.body.title == "manager" && role.title == "user") {
            role.title = req.body.title;
            user.role = req.body.title;

            const roleResp = await role.save();
            if (roleResp) {
              const userResp = await user.save();
              if (userResp) {
                SendInvitationEmail(user)
                  .then((res) => {
                    return resolve({
                      ...res,
                      code: HttpStatusCode.OK,
                      message:
                        UserMessages.ROLE_ASSIGNED +
                        " " +
                        AdminMessages.RESENT_INVITATION,
                    });
                  })
                  .catch((err) => {
                    return reject({
                      ...err,
                      message: GenericMessages.EMAIL_FAILED,
                    });
                  });
              } else {
                role.title = user.role;
                const roleResave = await role.save();

                return resolve({
                  code: HttpStatusCode.BAD_REQUEST,
                  message: UserMessages.ROLE_NOT_ASSIGNED,
                });
              }
            }
            return resolve({
              code: HttpStatusCode.CREATED,
              data: user,
              message: UserMessages.ROLE_ASSIGNED,
            });
          } else {
            return resolve({
              code: HttpStatusCode.BAD_REQUEST,
              message: UserMessages.MANAGER_ONLY,
            });
          }
        } else {
          return resolve({
            code: HttpStatusCode.NOT_FOUND,
            message: UserMessages.ROLE_NOT_ASSIGNED,
          });
        }
      })();
    } catch (error) {
      return resolve({
        code: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: GenericMessages.INTERNAL_SERVER_ERROR,
      });
    }
  });
};
