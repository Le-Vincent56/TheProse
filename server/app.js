// Node imports
require('dotenv').config();
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const helmet = require('helmet');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const redis = require('redis');

// Local imports
const router = require('./router.js');

// Establish port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Establish mongoDB connection
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1/DomoMaker';
mongoose.connect(dbURI).catch((err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

// Establish redis connection
const redisClient = redis.createClient({
  url: process.env.REDISCLOUD_URL,
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Connect to redis then start the app
redisClient.connect().then(() => {
  // Establish app
  const app = express();

  // Set app settings
  app.use(helmet());
  app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
  app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(session({
    key: 'sessionID', // Name of the cookie so it can be tracked
    store: new RedisStore({ // Utilize our redis database to store sessionIDs
      client: redisClient,
    }),
    secret: 'Montresor', // Private string used as a seed for hashing/creating unique session keys
    resave: false, // Only send the session keyback to the database if it changes
    saveUninitialized: false, // Prevents us from saving uninitialized session IDs to the database
  }));

  app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
  app.set('view engine', 'handlebars');
  app.set('views', `${__dirname}/../views`);

  // Link router
  router(app);

  // Start app
  app.listen(port, (err) => {
    if (err) { throw err; }
    console.log(`Listening on port ${port}`);
  });
});
