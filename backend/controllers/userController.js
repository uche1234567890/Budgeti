const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { encrypt } = require("../utils/cryptoUtils");

// Function to create Token that can be reused upon every user signup
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" }); // Creating a token that expires in 1 day
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_SECRET,
});

// Set up multer
const storage = multer.memoryStorage(); // store image in memory
const upload = multer({ storage: storage });

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send verification email
const sendVerificationEmail = (user, req) => {
  const tokenAndEmail = `${user.verificationToken}+${user.email}`;
  const encryptedTokenAndEmail = encrypt(tokenAndEmail);
  const verificationUrl = `https://testenv-budgetapp-ui-app.onrender.com/verify-email/${encryptedTokenAndEmail}`;
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: user.email,
    subject: "Email Verification",
    html: `<p>Please click the following link to verify your email: <a href="${verificationUrl}">Verify Email</a></p>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending verification email", err);
    } else {
      console.log("Verification email sent", info.response);
    }
  });
};

// Send password reset email
const sendPasswordResetEmail = (email, token, req) => {
  const tokenAndEmail = `${token}+${email}`;
  const encryptedTokenAndEmail = encrypt(tokenAndEmail);
  const resetUrl = `https://testenv-budgetapp-ui-app.onrender.com/reset-password/${encryptedTokenAndEmail}`;
  const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: email,
    subject: "Password Reset",
    html: `<p>Please click the following link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending password reset email", err);
    } else {
      console.log("Password reset email sent", info.response);
    }
  });
};

// Login Rate Limiter
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 login requests per windowMs
  message:
    "Too many login attempts from this IP, please try again after an hour",
});

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    // Creating a token
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    if (error.message === "Email not verified") {
      try {
        const user = await User.resendVerificationToken(email);
        sendVerificationEmail(user, req);
        return res.status(400).json({
          error: "Email not verified. A new verification email has been sent.",
        });
      } catch (resendError) {
        return res.status(400).json({ error: resendError.message });
      }
    }
    res.status(400).json({ error: error.message });
  }
};

// Signup User
const signupUser = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;
  try {
    const user = await User.signup(
      firstname,
      lastname,
      username,
      email,
      password
    );
    // Send verification email
    sendVerificationEmail(user, req);
    res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    await User.verifyEmail(token);
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Edit User
const editUser = async (req, res) => {
  const { firstname, lastname, username } = req.body;
  const userId = req.user._id;
  try {
    const user = await User.editUser(userId, firstname, lastname, username);
    res
      .status(200)
      .json({ message: "User details updated successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Initiate Password Reset
const initiatePasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const token = await User.initiatePasswordReset(email);
    sendPasswordResetEmail(email, token, req);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;
  try {
    await User.resetPassword(email, token, newPassword);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const uploadProfilePicture = async (req, res, next) => {
  const userId = req.user._id;

  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }
  if (!req.file.mimetype.startsWith("image/")) {
    return res.status(400).json({ error: "Invalid File type" });
  }

  try {
    // Setup Cloudinary upload stream
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "budgeti",
        format: "png",
        public_id: `${req.file.originalname.replace(
          /\.[^/.]+$/,
          ""
        )}_${Date.now()}`,
        transformation: {
          width: 400,
          height: 400,
          crop: "fill",
          quality: "auto:good",
          gravity: "faces",
          fetch_format: "auto",
          max_bytes: 80000,
        },
      },
      async (error, result) => {
        if (error) {
          console.error("Error uploading to Cloudinary", error);
          return res
            .status(500)
            .json({ error: "Error uploading image to Cloudinary" });
        }

        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        user.profilePicture = result.secure_url;
        await user.save();

        res.status(200).json({
          message: "Profile picture updated successfully",
          url: result.secure_url,
        });
      }
    );

    // Stream the file buffer to Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } catch (error) {
    console.error("Error processing image", error);
  }
};

module.exports = {
  loginUser,
  signupUser,
  verifyEmail,
  editUser,
  initiatePasswordReset,
  resetPassword,
  loginLimiter,
  uploadProfilePicture,
  upload,
};