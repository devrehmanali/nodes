const { HttpStatusCode, GenericMessages } = require("../../../constants");
const Role = require("../../../models/Role");
exports.isSuperAdmin = async (req, res, next) => {
  if (req.jwt.role == "super") {
    next();
  } else {
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      code: HttpStatusCode.UNAUTHORIZED,
      message: GenericMessages.ADMIN_ALLOWED,
    });
  }
};
exports.isAdmin = async (req, res, next) => {
  if (req.jwt.role == "admin") {
    next();
  } else {
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      code: HttpStatusCode.UNAUTHORIZED,
      message: GenericMessages.ADMIN_ALLOWED,
    });
  }
};
exports.isSuperOrAdmin = async (req, res, next) => {
  if (req.jwt.role == "admin" || req.jwt.role == "super") {
    next();
  } else {
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      code: HttpStatusCode.UNAUTHORIZED,
      message: GenericMessages.ADMIN_ALLOWED,
    });
  }
};
exports.isRoleExists = async (req) => {
  return new Promise((resolve) => {
    try {
      Role.findOne(
        { parentId: req.user._id, userId: req.body.userId },
        (err, role) => {
          return resolve(role ? role : null);
        }
      );
    } catch (error) {
      return resolve(null);
    }
  });
};

exports.createRole = (req, roleToAss, userId) => {
  return new Promise((resolve) => {
    try {
      (async () => {
        const exist = await this.isRoleExists({
          parentId: null,
          userId: userId,
        });
        console.log(exist, "KOKOKKOKOKOKO");
        if (exist) {
          return resolve({
            code: 400,
            message: "Role already exists",
          });
        } else {
          const role = await Role.create({
            title: roleToAss,
            parentId: null,
            userId: userId,
          });
          console.log(role, "MKMKMKMKMKMK");
          if (role) {
            return resolve({
              code: 200,
              data: role,
              message: "Role created successfully!",
            });
          } else {
            return resolve({
              code: 400,
              message: "Could not create role.",
            });
          }
        }
      })();
    } catch (error) {
      return resolve({ code: 500, message: "Internal server error." });
    }
  });
};

exports.assignAsManagerRole = (req, userId) => {
  return new Promise((resolve) => {
    try {
      (async () => {
        const role = await Role.findOne({
          parentId: req.jwt.id,
          userId: userId,
        });
        if (role) {
          role.title = req.body.title;
          role.save((err, role) => {
            if (err || !role) {
              return resolve({
                code: 200,
                data: role,
                message: "Role created successfully!",
              });
            }
          });
        } else {
          return resolve({
            code: 400,
            message: "Could not assign role.",
          });
        }
      })();
    } catch (error) {
      return resolve({ code: 500, message: "Internal server error." });
    }
  });
};
