const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  parentId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});
const Role = mongoose.model("Role", RoleSchema);
module.exports = Role;
