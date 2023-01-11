const express = require("express");
const { checkAuth } = require("../middlewares/checkAuth");
const serviceRouter = express.Router();

/**
 * @Route User Routes
 * @dev These routes will be used for the User.
 */
serviceRouter.use("/auth", require("../services/auth"));

serviceRouter.use("/admins", [checkAuth], require("../services/admin/admins"));

module.exports = serviceRouter;
