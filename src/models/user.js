import { Schema, model } from "mongoose";
import { genSalt, hash, compare } from "bcrypt";

const UserSchema = new Schema({
  fullName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resumeData: {
    type: Object,
  },

  templates: [],
  userType: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return compare(password, this.password);
};

const User = model("User", UserSchema);
export default User;
