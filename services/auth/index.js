const express = require("express");
const routes = require("./routes");
const serviceRouter = express.Router();
const {
  loginValidator,
  resetValidator,
  forgetValidator,
  confirmUserValidator,
  registerValidator,
} = require("./validator");

const { checkValidation } = require("../../middlewares/validator");

serviceRouter.post("/login", [loginValidator, checkValidation], (req, res) =>
  routes["apiRoute"](req, res, "authLogin")
);

serviceRouter.post(
  "/register",
  [registerValidator, checkValidation],
  (req, res) => routes["apiRoute"](req, res, "createAdmin")
);
serviceRouter.post(
  "/resetPassword",
  [resetValidator, checkValidation],
  (req, res) => routes["apiRoute"](req, res, "resetPassword")
);
serviceRouter.post(
  "/forgetPassword",
  [forgetValidator, checkValidation],
  (req, res) => routes["apiRoute"](req, res, "forgetPassword")
);
serviceRouter.post(
  "/confirmation",
  [confirmUserValidator, checkValidation],
  (req, res) => routes["apiRoute"](req, res, "confirmation")
);

module.exports = serviceRouter;
