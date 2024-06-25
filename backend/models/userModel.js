const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");
const crypto = require("crypto");

// Schema for the user collection in the database
const userSchema = new Schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    profilePicture: {
      type: String,
      default:
        "https://asset.cloudinary.com/darjwo40n/04e8a16f2831779e78a7fd92af361494", // default avatar URL
    },
  },
  { timestamps: true }
);

// Static Signup Method
userSchema.statics.signup = async function (
  firstname,
  lastname,
  username,
  email,
  password
) {
  if (!firstname || !lastname || !username || !email || !password) {
    throw Error("All field must be filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }

  const emailExists = await this.findOne({ email });

  if (emailExists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpires = Date.now() + 6 * 60 * 60 * 1000; // 6 hours

  const user = await this.create({
    firstname,
    lastname,
    username,
    email,
    password: hash,
    verificationToken,
    verificationTokenExpires,
  });

  return user;
};

userSchema.statics.verifyEmail = async function (token) {
  const user = await this.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Token is invalid or has expired");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  return user;
};

userSchema.statics.resendVerificationToken = async function (email) {
  const user = await this.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("Email is already verified");
  }

  user.verificationToken = crypto.randomBytes(32).toString("hex");
  user.verificationTokenExpires = Date.now() + 6 * 60 * 60 * 1000; // 6 hours
  await user.save();

  return user;
};

// Static Login Method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All field must be filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect email or password");
  }

  if (!user.isVerified) {
    throw Error("Email not verified");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect email or password");
  }

  return user;
};

// Static Edit User Method
userSchema.statics.editUser = async function (
  userId,
  firstname,
  lastname,
  username
) {
  const user = await this.findById(userId);

  if (!user) {
    throw Error("User not found");
  }

  user.firstname = firstname || user.firstname;
  user.lastname = lastname || user.lastname;
  user.username = username || user.username;

  await user.save();

  return user;
};

// Static Reset Password Methods
userSchema.statics.initiatePasswordReset = async function (email) {
  const user = await this.findOne({ email });

  if (!user) {
    throw Error("User not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

  await user.save();

  return resetToken;
};

userSchema.statics.resetPassword = async function (email, token, newPassword) {
  const user = await this.findOne({
    email,
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Token is invalid or has expired");
  }

  // Check if the new password is the same as the old password
  const isSamePassword = await bcrypt.compare(newPassword, user.password);
  if (isSamePassword) {
    throw new Error("New password cannot be the same as the old password");
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw Error("Password is not strong enough");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return user;
};

module.exports = mongoose.model("User", userSchema);