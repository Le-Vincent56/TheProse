// Imports
const url = require('url');
const query = require('querystring');
const models = require('../models');

const { Account } = models;

const profilePage = (req, res) => {
  const parsedURL = url.parse(req.url);
  const params = query.parse(parsedURL.query);

  res.render('profile', { username: params.user });
};

const redirectProfile = (req, res) => {
  const parsedURL = url.parse(req.url);
  const params = query.parse(parsedURL.query);

  return res.status(200).json({ redirect: `/profile?user=${params.user}` });
};

const resetPass = (req, res) => {
  const parsedURL = url.parse(req.url);
  const params = query.parse(parsedURL.query);

  res.render('resetpass', { query: `/profile?user=${params.user}` });
};
const getResetPass = (req, res) => {
  const parsedURL = url.parse(req.url);
  const params = query.parse(parsedURL.query);

  return res.status(200).json({ redirect: `/resetpass?user=${params.user}` });
};

const getProfile = async (req, res) => {
  const parsedURL = url.parse(req.url);
  const params = query.parse(parsedURL.query);

  try {
    let profileQuery;
    if (params.user) {
      profileQuery = { username: params.user };
    } else if (params.id) {
      profileQuery = { _id: params.id };
    }

    const docs = await Account.find(profileQuery)
      .select('username bio premium createdDate')
      .lean()
      .exec();

    // Check if the current account is the found profile
    if (req.session.account.username !== params.user) {
      docs[0].isCurrentUser = false;
    } else {
      docs[0].isCurrentUser = true;
    }

    return res.status(200).json({ profile: docs });
  } catch (err) {
    // Log any errors
    console.log(err);
    return res.status(500).json({ error: 'Error receiving profile' });
  }
};

const editProfile = async (req, res) => {
  try {
    const profileQuery = { _id: req.body.id };
    const updateProfile = await Account.findOneAndUpdate(
      profileQuery,
      { bio: req.body.bio },
    ).lean().exec();

    return res.status(200).json({ updateProfile, message: 'Updated profile!' });
  } catch (err) {
    // Log any errors
    console.log(err);
    return res.status(500).json({ error: 'Error editing profile' });
  }
};

const getAllProfilesByUsername = async (req, res) => {
  const parsedURL = url.parse(req.url);
  const params = query.parse(parsedURL.query);

  try {
    // If nothing is given, return an empty array
    if (params.user === '') {
      return res.status(200).json({ profiles: [] });
    }

    // Create a query term and a regular expression to use for further searching
    const queryTerm = params.user;
    const regex = new RegExp(queryTerm, 'i');

    // Create a query that includes the query term
    const profileQuery = {
      username: { $regex: regex },
    };

    // Find all users the includes the query term
    const docs = await Account.find(profileQuery)
      .select('username createdDate')
      .lean()
      .exec();

    // Remove the current user from the search
    const finalDocs = docs.filter(
      (profile) => profile.username !== req.session.account.username,
    );

    // Select all of the user's friends
    const userQuery = { username: req.session.account.username };
    const currentAccount = await Account.find(userQuery).select('friends').lean().exec();

    // See if the user is already friends with the found profile
    const updatedFinalDocs = finalDocs.map((profile) => {
      const updatedProfile = { ...profile };
      updatedProfile.isFriend = currentAccount[0].friends.some(
        (friendId) => friendId.equals(profile._id),
      );
      return updatedProfile;
    });

    return res.status(200).json({ profiles: updatedFinalDocs });
  } catch (err) {
    // Log any errors
    console.log(err);
    return res.status(500).json({ error: 'Error finding profiles ' });
  }
};

const getFriends = async (req, res) => {
  const parsedURL = url.parse(req.url);
  const params = query.parse(parsedURL.query);

  try {
    const profileQuery = { username: params.user };
    const docs = await Account.find(profileQuery)
      .select('friends')
      .lean()
      .exec();

    return res.status(200).json({ profile: docs });
  } catch (err) {
    // Log any errors
    console.log(err);
    return res.status(500).json({ error: 'Error receiving friends' });
  }
};

const getFriendData = async (req, res) => {
  const parsedURL = url.parse(req.url);
  const params = query.parse(parsedURL.query);

  try {
    const profileQuery = { username: params.user };
    const docs = await Account.find(profileQuery)
      .select('friends followers')
      .lean()
      .exec();

    return res.status(200).json({ friends: docs });
  } catch (err) {
    // Log any errors
    console.log(err);
    return res.status(500).json({ error: 'Error getting friend data' });
  }
};

const getFollowers = async (req, res) => {
  const parsedURL = url.parse(req.url);
  const params = query.parse(parsedURL.query);

  try {
    const profileQuery = { username: params.user };
    const docs = await Account.find(profileQuery)
      .select('followers')
      .lean()
      .exec();

    return res.status(200).json({ profile: docs });
  } catch (err) {
    // Log any errors
    console.log(err);
    return res.status(500).json({ error: 'Error receiving followers' });
  }
};

const updatePremium = async (req, res) => {
  try {
    const profileQuery = { username: req.session.account.username };
    const docs = await Account.findOneAndUpdate(
      profileQuery,
      { premium: req.body.premium },
    ).lean().exec();

    return res.status(200).json({ profile: docs });
  } catch (err) {
    // Log any errors
    console.log(err);
    return res.status(500).json({ error: 'Error editing profile' });
  }
}

module.exports = {
  profilePage,
  redirectProfile,
  resetPass,
  getResetPass,
  getProfile,
  editProfile,
  getAllProfilesByUsername,
  getFriends,
  getFriendData,
  getFollowers,
  updatePremium,
};
