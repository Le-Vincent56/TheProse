// Imports
const mongoose = require('mongoose');
const _ = require('underscore');

// Set the domo name
const setName = (name) => _.escape(name).trim();

// Define the Domo schema
const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  level: {
    type: Number,
    min: 1,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  id: {
    type: Number,
    required: true,
  },
});

// Converts a doc to something we can store in redis later on.
DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  level: doc.level,
  id: doc.id,
});

// Establish the Domo model
const DomoModel = mongoose.model('Domo', DomoSchema);

// Exports
module.exports = DomoModel;
