// Local imports - imports controllers/index.js
const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  
  app.get('/profile', mid.requiresLogin, controllers.Profile.profilePage);
  app.get('/resetpass', mid.requiresSecure, mid.requiresLogin, controllers.Profile.resetPass);
  app.post('/resetpass', mid.requiresSecure, mid.requiresLogin, controllers.Account.resetPass);
  app.get('/getPosts', mid.requiresLogin, controllers.Post.getPosts);
  app.get('/getPost', mid.requiresLogin, controllers.Post.getPost);
  app.get('/getProfile', mid.requiresLogin, controllers.Profile.getProfile);
  app.post('/saveDraft', mid.requiresLogin, controllers.Post.makePost);
  app.post('/editDraft', mid.requiresLogin, controllers.Post.editPost);
  app.post('/postwork', mid.requiresLogin, controllers.Post.makePost);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

// Exports
module.exports = router;
