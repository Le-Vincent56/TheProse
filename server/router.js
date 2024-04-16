// Local imports - imports controllers/index.js
const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/profile', mid.requiresLogin, controllers.Profile.profilePage);
  app.get('/getPosts', mid.requiresLogin, controllers.Post.getPosts);
  app.get('/getPost', mid.requiresLogin, controllers.Post.getPost);
  app.post('/postwork', mid.requiresLogin, controllers.Post.makePost);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  
  app.get('/homeGuest', mid.requiresSecure, mid.requiresLogout, controllers.Home.homeGuestPage);
  app.get('/home', mid.requiresLogin, controllers.Home.homeUserPage);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Home.homeGuestPage);
};

// Exports
module.exports = router;
