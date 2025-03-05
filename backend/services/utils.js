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

module.exports = { isAuthenticated, generatePaymentReference };
