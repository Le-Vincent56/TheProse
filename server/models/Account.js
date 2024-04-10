// Imports
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Define the number of times we will has the password
const saltRounds = 10;

let AccountModel = {};

// Define the Account schema
const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

// Converts a doc to something we can store in redis later on.
AccountSchema.statics.toAPI = (doc) => ({
  username: doc.username,
  _id: doc._id,
});

// Function to generate a hashed password
AccountSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);

// Authenticate Function
AccountSchema.statics.authenticate = async (username, password, callback) => {
  try {
    // Try to find an account with the username
    const doc = await AccountModel.findOne({ username }).exec();

    // If no document is found, call the callback function with no parameters
    if (!doc) {
      return callback();
    }

    // If there's match, have bcrypt compare the password with the hashed password
    const match = await bcrypt.compare(password, doc.password);

    // If there's a match, then return the account in the callback
    if (match) {
      return callback(null, doc);
    }

    // If there's not, call the callback function with no parameters
    return callback();
  } catch (err) {
    // If there's an error, return the callback with the error
    return callback(err);
  }
};

// Establish the model
AccountModel = mongoose.model('Account', AccountSchema);

// Exports
module.exports = AccountModel;
