const nodemailer = require("nodemailer");

const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
};

function generatePaymentReference() {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 10000);
  return `PAY${timestamp}${randomNum}`;
}

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password
  },
});

// Function to send email verification link
function sendVerificationLink(email, token) {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <p><a href="${verificationUrl}">Verify Email</a></p>
      <p>Or copy and paste this link in your browser:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link expires in 24 hours.</p>
      <p>If you did not request this verification, please ignore this email.</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
      return false;
    } else {
      console.log("Verification email sent:", info.response);
      return true;
    }
  });
}

module.exports = {
  isAuthenticated,
  generatePaymentReference,
  sendVerificationLink,
};
