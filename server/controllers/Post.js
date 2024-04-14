// Imports
const models = require('../models');

const { Post } = models;

const makePost = async (req, res) => {
  // Check if the post has a name, an age, or a level
  if (!req.body.name || !req.body.body || !req.body.genre || !req.body.author) {
    return res.status(400).json({ error: 'A name, body, genre, and author are required!' });
  }

  // Create the post data
  const postData = {
    name: req.body.name,
    body: req.body.body,
    genre: req.body.genre,
    author: req.body.author,
    owner: req.session.account._id,
    id: Math.floor(Math.random() * 1000000)
  };

  let posts = null;

  // Compare posts
  try {
    // Try to get the posts for the account id
    const query = { owner: req.session.account._id };
    posts = await Post.find(query).select('name author id').lean().exec();
  } catch (err) {
    // Log any errors and return a status code
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving posts!' });
  }

  // Check if the name is unique
  for(let i = 0; i < posts.length; i++) {
    if(posts[i].name === postData.name) {
      return res.status(400).json({error: "A unique title is required"});
    }
  }

  // Check if the id is unique
  let uniqueID = false;
  while (!uniqueID) {
    // If there are no posts, the unique ID is guaranteed
    if (posts.length === 0) {
      uniqueID = true;
    }

    // Compare IDs
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].id === postData.id) {
        uniqueID = false;
      } else {
        uniqueID = true;
      }
    }

    // Set a new id
    postData.id = Math.floor(Math.random() * 10000);
  }

  try {
    // Create and save the post using the data and the post model
    const newPost = new Post(postData);
    await newPost.save();

    // Once complete, redirect to the maker page
    return res.status(201).json(
      { 
        name: newPost.name,
        author: newPost.author,
      }
    );
  } catch (err) {
    // If there's an error, log it
    console.log(err);

    // If the post already exists, then return a status code
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Post already exists!' });
    }

    // Return a general status code
    return res.status(500).json({ error: 'An error occurred making a Post!' });
  }
};

const editPost = async (req, res) => {
  // Create a post object from the posted data
  const postData = {
    name: req.body.name,
    body: req.body.body,
    genre: req.body.genre,
    author: req.body.author,
    id: req.body.id,
  };

  try {
    // Get a query and update data
    const query = { id: req.body.id };
    const updatePost = await Post.findOneAndUpdate(
      query,
      {
        name: postData.name,
        body: postData.body,
        genre: postData.genre,
        author: postData.author,
      },
    ).lean().exec();
    return res.status(200).json({ updatePost });
  } catch (err) {
    // Log any errors and return a status code
    console.log(err);
    return res.status(500).json({ error: 'Error editing post!' });
  }
};

const getPosts = async (req, res) => {
  try {
    // Try to get the posts for the account id
    const query = { owner: req.session.account._id };
    const docs = await Post.find(query).select('name body genre author id').lean().exec();

    // Return the posts in a json
    return res.json({ posts: docs });
  } catch (err) {
    // Log any errors and return a status code
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving posts!' });
  }
};

// Exports
module.exports = {
  makePost,
  editPost,
  getPosts,
};
