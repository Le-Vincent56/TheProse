// Imports
const models = require('../models');

const { Domo } = models;

const makerPage = async (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  // Check if the Domo has a name, an age, or a level
  if (!req.body.name || !req.body.age || !req.body.level) {
    return res.status(400).json({ error: 'A name, age, and level are required!' });
  }

  // Create the Domo data
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    level: req.body.level,
    owner: req.session.account._id,
    id: Math.floor(Math.random() * 10000),
  };

  let domos = null;

  // Compare domos
  try {
    // Try to get the domos for the account id
    const query = { owner: req.session.account._id };
    domos = await Domo.find(query).select('name age level id').lean().exec();
  } catch (err) {
    // Log any errors and return a status code
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }

  // Check if the id is unique
  let uniqueID = false;
  while (!uniqueID) {
    // If there are no domos, the unique ID is guaranteed
    if (domos.length === 0) {
      uniqueID = true;
    }

    // Compare IDs
    for (let i = 0; i < domos.length; i++) {
      if (domos[i].id === domoData.id) {
        uniqueID = false;
      } else {
        uniqueID = true;
      }
    }

    // Set a new id
    domoData.id = Math.floor(Math.random() * 10000);
  }

  try {
    // Create and save the domo using the data and the domo model
    const newDomo = new Domo(domoData);
    await newDomo.save();

    // Once complete, redirect to the maker page
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, level: newDomo.level });
  } catch (err) {
    // If there's an error, log it
    console.log(err);

    // If the domo already exists, then return a status code
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }

    // Return a general status code
    return res.status(500).json({ error: 'An error occurred making a Domo!' });
  }
};

const editDomo = async (req, res) => {
  // Create a domo object from the posted data
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    level: req.body.level,
    id: req.body.id,
  };

  try {
    // Get a query and update data
    const query = { id: req.body.id };
    const updateDomo = await Domo.findOneAndUpdate(
      query,
      {
        name: domoData.name,
        age: domoData.age,
        level: domoData.level,
      },
    ).lean().exec();
    return res.status(200).json({ updateDomo });
  } catch (err) {
    // Log any errors and return a status code
    console.log(err);
    return res.status(500).json({ error: 'Error editing domo!' });
  }
};

const getDomos = async (req, res) => {
  try {
    // Try to get the domos for the account id
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age level id').lean().exec();

    // Return the domos in a json
    return res.json({ domos: docs });
  } catch (err) {
    // Log any errors and return a status code
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

// Exports
module.exports = {
  makerPage,
  makeDomo,
  editDomo,
  getDomos,
};
