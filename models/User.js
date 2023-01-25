const mongoose = require("mongoose");
const { Schema } = mongoose;
const CryptoJS = require("crypto-js");
const HEX = require("crypto-js/enc-hex");
const JWT = require("../middlewares/jwt");

const keylength = 256;
const iter = 1000;

const UserSchema = new Schema(
  {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    mobile: { type: String, default: "" },
    email: { type: String, unique: true, default: "" },
    dob: { type: String, default: "" },
    address: { type: String, default: "" },
    google2faEnabled: { type: Boolean, default: false },
    google2faSecret: { type: String, default: "" },
    role: { type: String, default: "user" },
    salt: { type: String, default: "" },
    password: { type: String, default: "" },
    enabled: { type: Boolean, default: true },
    parentId: { type: mongoose.Types.ObjectId, default: null },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.methods.setPassword = function (password) {
  this.salt = HEX.stringify(CryptoJS.lib.WordArray.random(16));
  this.password = HEX.stringify(
    CryptoJS.PBKDF2(password, this.salt, {
      keySize: keylength,
      iterations: iter,
    })
  );
};

UserSchema.methods.validatePassword = function (password) {
  const hash = HEX.stringify(
    CryptoJS.PBKDF2(password, this.salt, {
      keySize: keylength,
      iterations: iter,
    })
  );
  return this.password === hash;
};

UserSchema.methods.generateJWT = function () {
  return JWT.sign({
    id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    suspended: this.suspended,
    role: this.role,
  });
};

UserSchema.methods.toAuthJSON = function () {
  return {
    id: this._id,
    email: this.email,
    token: this.generateJWT(),
    firstName: this.firstName,
    lastName: this.lastName,
    role: this.role,
  };
};
UserSchema.methods.toProfile = function () {
  return {
    id: this._id,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    mobile: this.mobile,
    walletAddress: this.walletAddress,
    role: this.role,
    enabled: this.enabled,
  };
};

UserSchema.virtual("BrokerUsersId", {
  ref: "Role",
  localField: "_id",
  foreignField: "parentId",
});
const User = mongoose.model("User", UserSchema);

module.exports = User;
