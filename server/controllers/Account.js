// Local imports - imports models/index.js
const url = require('url');
const query = require('querystring');
const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  const parsedURL = url.parse(req.url);
  const params = query.parse(parsedURL.query);

  if (params.signup === 'true') {
    res.render('login', {
      signup: true,
    });
  } else {
    res.render('login', {
      signup: false,
    });
  }
};

const logout = (req, res) => {
  // Destroy session cookies to notify the server of logout
  req.session.destroy();

  // Direct back to the home page
  res.redirect('/');
};

const login = (req, res) => {
  // Retrieve data
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  // Check if both a username and password were given
  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  // Authenticate the login
  return Account.authenticate(username, pass, (err, account) => {
    // Check if there's an error, or if the account is invalid
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    // Save the account to the session cookies and track data
    req.session.account = Account.toAPI(account);

    // Redirect to the profile page
    return res.json({ redirect: `/profile?user=${username}` });
  });
};

const signup = async (req, res) => {
  // Retrieve data
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  // Check if all fields were given
  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  // Check if the passwords match
  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  // Try to create a user
  try {
    // Hash the password
    const hash = await Account.generateHash(pass);

    // Create the new account and save it
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();

    // Save the account to the session cookies and track data
    req.session.account = Account.toAPI(newAccount);

    // Redirect back to the profile page
    return res.json({ redirect: `/profile?user=${username}` });
  } catch (err) {
    // Log the error
    console.log(err);

    // If the error code is 11000, there is a mongoDB duplicate entry
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }

    // Return a 500 status
    return res.status(500).json({ error: 'An error occurred' });
  }
};

const resetPass = async (req, res) => {
  // Retrieve data
  const accountData = {
    username: req.body.username,
    password: req.body.pass,
    newPassword: req.body.pass2,
  };

  // Check if all fields were given
  if (!accountData.username || !accountData.password
    || !accountData.newPassword) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  try {
    // Try to get into the account
    return Account.authenticate(
      accountData.username,
      accountData.password,
      async (err, account) => {
      // Check if there's an error, or if the account is invalid
        if (err || !account) {
          return res.status(401).json({ error: 'Wrong username or password!' });
        }

        // Hash the password
        const hash = await Account.generateHash(accountData.newPassword);
        const accountQuery = { username: accountData.username };
        const updateAccount = await Account.findOneAndUpdate(
          accountQuery,
          {
            username: accountData.username,
            password: hash,
          },
        ).lean().exec();

        // Redirect to the /login page
        return res.json({ updateAccount, redirect: `/profile?user=${accountData.username}` });
      },
    );
  } catch (err) {
    // Log any errors and return a status code
    console.log(err);
    return res.status(500).json({ error: 'Error editing post!' });
  }
};

// Exports
module.exports = {
  loginPage,
  logout,
  login,
  signup,
  resetPass,
};
