const express = require("express");
const serviceRouter = express.Router();

/**
 * @Route User Routes
 * @dev These routes will be used for the User.
 */
serviceRouter.use("/auth", [], () => {});

module.exports = serviceRouter;
