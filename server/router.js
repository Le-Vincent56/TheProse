// Local imports - imports controllers/index.js
const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/resetpass', mid.requiresSecure, mid.requiresLogin, controllers.Profile.resetPass);
  app.get('/getResetPass', mid.requiresSecure, mid.requiresLogin, controllers.Profile.getResetPass);
  app.post('/resetpass', mid.requiresSecure, mid.requiresLogin, controllers.Account.resetPass);

  app.get('/profile', mid.requiresLogin, controllers.Profile.profilePage);
  app.get('/getProfile', mid.requiresLogin, controllers.Profile.getProfile);
  app.post('/editProfile', mid.requiresLogin, controllers.Profile.editProfile);
  app.get('/searchProfiles', mid.requiresLogin, controllers.Profile.getAllProfilesByUsername);
  app.get('/redirectProfile', mid.requiresLogin, controllers.Profile.redirectProfile);

  app.get('/getFriendData', mid.requiresLogin, controllers.Profile.getFriendData);

  app.get('/getFriends', mid.requiresLogin, controllers.Profile.getFriends);
  app.post('/addFriend', mid.requiresLogin, controllers.Account.addFriend);
  app.post('/removeFriend', mid.requiresLogin, controllers.Account.removeFriend);

  app.get('/getPost', mid.requiresLogin, controllers.Post.getPost);
  app.get('/getPosts', mid.requiresLogin, controllers.Post.getPosts);
  app.post('/saveDraft', mid.requiresLogin, controllers.Post.makePost);
  app.post('/editPost', mid.requiresLogin, controllers.Post.editPost);
  app.post('/deletePost', mid.requiresLogin, controllers.Post.deletePost);
  app.post('/postwork', mid.requiresLogin, controllers.Post.makePost);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

// Exports
module.exports = router;
