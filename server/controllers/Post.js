// Imports
const url = require('url');
const query = require('querystring');
const models = require('../models');

const { Post } = models;

const makePost = async (req, res) => {
  // Check if the post has a title, an author, genres, or a body
  if (!req.body.title || !req.body.author || !req.body.genre || !req.body.body) {
    return res.status(400).json({ error: 'A title, author, genre, and body is required' });
  }

  // Create the post data
  const postData = {
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    body: req.body.body,
    private: req.body.private,
    owner: req.session.account._id,
    id: Math.floor(Math.random() * 1000000),
  };

  let posts = null;

  // Compare posts
  try {
    // Try to get the posts for the account id
    const postQuery = { owner: req.session.account._id };
    posts = await Post.find(postQuery).select('title author id').lean().exec();
  } catch (err) {
    // Log any errors and return a status code
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving posts!' });
  }

  // Check if the title is unique
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].title === postData.title) {
      return res.status(400).json({ error: 'A unique title is required' });
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

  // Determine the correct message depending on visibility
  let messageString = '';
  if (postData.private) {
    messageString = 'Saved as a draft!';
  } else {
    messageString = 'Posted!';
  }

  try {
    // Create and save the post using the data and the post model
    const newPost = new Post(postData);
    await newPost.save();

    // Once complete, redirect to the maker page
    return res.status(201).json(
      {
        title: newPost.title,
        author: newPost.author,
        message: messageString,
      },
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
    title: req.body.title,
    body: req.body.body,
    genre: req.body.genre,
    author: req.body.author,
    private: req.body.private,
    id: req.body.id,
  };

  try {
    // Get a query and update data
    const postQuery = { id: postData.id };
    const updatePost = await Post.findOneAndUpdate(
      postQuery,
      {
        title: postData.title,
        body: postData.body,
        genre: postData.genre,
        author: postData.author,
        private: postData.private,
      },
    ).lean().exec();

    return res.status(200).json({ updatePost, message: 'Updated post!' });
  } catch (err) {
    // Log any errors and return a status code
    console.log(err);
    return res.status(500).json({ error: 'Error editing post!' });
  }
};

const getPosts = async (req, res) => {
  const parsedURL = url.parse(req.url);
  const params = query.parse(parsedURL.query);

  try {
    // Try to get the posts for the account id
    const postQuery = { owner: params.id };
    const docs = await Post.find(postQuery).select('title body genre author private id').lean().exec();

    // Check if the account is the user's
    if(postQuery.owner.toString() === req.session.account._id.toString()) {
      // If so, return all posts
      return res.json({posts: docs})
    } else {
      // Otherwise, filter public posts
      let shownPosts = [];
      for(const post of docs) {
        if(!post.private) {
          shownPosts.push(post);
        }
      }

      // Only return public posts
      return res.json({posts: shownPosts});
    }
  } catch (err) {
    // Log any errors and return a status code
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving posts!' });
  }
};

const getPost = async (req, res) => {
  const parsedURL = url.parse(req.url);
  const params = query.parse(parsedURL.query);

  try {
    const postQuery = { id: params.id };
    const docs = await Post.find(postQuery).select('title body genre author private id').lean().exec();

    // Return the post in a json
    return res.json({ post: docs });
  } catch (err) {
    // Log any errors and return a status code
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving posts!' });
  }
};

const deletePost = async (req, res) => {
  try {
    // Create query
    const postQuery = { 
      owner: req.session.account._id, 
      id: req.body.postID
    };

    // Delete the post
    const docs = await Post.deleteOne(postQuery).lean().exec();

    return res.json({
      deletedPost: docs, 
      redirect: `/profile?user=${req.session.account.username}`
    });
  } catch (err) {
    // Log any errors and return a status code
    console.log(err);
    return res.status(500).json({ error: 'Error deleting post!' });
  }
};

// Exports
module.exports = {
  makePost,
  editPost,
  getPosts,
  getPost,
  deletePost,
};
