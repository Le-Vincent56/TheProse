// Local imports - imports models/index.js
const models = require('../models');

const { Account } = models;

const homeGuestPage = (req, res) => res.render('homeGuest');
const homeUserPage = (req, res) => res.render('homeUser');

// Exports
module.exports = {
    homeGuestPage,
    homeUserPage,
  };