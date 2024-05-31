const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

//Function to create Token that can be reused upon every user signup
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "1d" }); //Creating a token that expires in 1 day
};

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
  const verificationUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/user/verify-email/${user.verificationToken}`;
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
        return res
          .status(400)
          .json({
            error:
              "Email not verified. A new verification email has been sent.",
          });
      } catch (resendError) {
        return res.status(400).json({ error: resendError.message });
      }
    }
    res.status(400).json({ error: error.message });
  }
};

//Signup User
const signupUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const user = await User.signup(firstname, lastname, email, password);

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

module.exports = {
  loginUser,
  signupUser,
  verifyEmail,
};