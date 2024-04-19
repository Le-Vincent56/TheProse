// Checks if the server has attached an account to their session
const requiresLogin = (req, res, next) => {
  // If not, redirect them to the home page
  if (!req.session.account) {
    return res.redirect('/');
  }

  return next();
};

// Checks if the user is already logged in
const requiresLogout = (req, res, next) => {
  // If so, redirect them to the app
  if (req.session.account) {
    return res.redirect(`/profile?user=${req.session.account.username}`);
  }

  return next();
};

// Check if the user is on HTTPS
const requiresSecure = (req, res, next) => {
  // Checks if the forwarded request is secure by checking
  // the "x-forwarded-proto" header
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }

  return next();
};

// Bypass the security check
const bypassSecure = (req, res, next) => {
  next();
};

// Exports
module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

// Check if on Heroku, then send the correct security check
if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
