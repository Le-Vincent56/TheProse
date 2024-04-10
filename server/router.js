// Local imports - imports controllers/index.js
const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Domo.makeDomo);
  app.post('/save', mid.requiresLogin, controllers.Domo.editDomo);

  app.get('/homeGuest', mid.requiresSecure, mid.requiresLogout, controllers.Home.homeGuestPage);
  app.get('/home', mid.requiresLogin, controllers.Home.homeUserPage);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Home.homeGuestPage);
};

// Exports
module.exports = router;
