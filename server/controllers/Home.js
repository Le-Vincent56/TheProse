const homeGuestPage = (req, res) => res.render('homeGuest');
const homeUserPage = (req, res) => res.render('homeUser');

// Exports
module.exports = {
    homeGuestPage,
    homeUserPage,
  };