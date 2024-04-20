// Imports
const url = require('url');
const query = require('querystring');
const models = require('../models');
const { Account } = models;

const profilePage = (req, res) => {
    const parsedURL = url.parse(req.url);
    const params = query.parse(parsedURL.query);

    res.render('profile', {username: params.user});
};
const resetPass = (req, res) => {
    const parsedURL = url.parse(req.url);
    const params = query.parse(parsedURL.query);

    res.render('resetpass', {query: `/profile?user=${params.user}`});
};
const getResetPass = (req, res) => {
    const parsedURL = url.parse(req.url);
    const params = query.parse(parsedURL.query);

    return res.json({redirect: `/resetpass?user=${params.user}`});
}

const getProfile = async (req, res) => {
    const parsedURL = url.parse(req.url);
    const params = query.parse(parsedURL.query);

    try {
        const query = { username: params.user };
        const docs = await Account.find(query).select('username bio createdDate').lean().exec();

        // Check if the current account is the found profile
        if(req.session.account.username !== params.user) {
            docs[0].isCurrentUser = false;
        } else {
            docs[0].isCurrentUser = true;
        }

        return res.json({profile: docs});
    } catch (err) {
        // Log any errors
        console.log(err);
        return res.status(500).json({error: 'Error receiving profile'});
    }
}

const editProfile = async (req, res) => {
    try {
        const query = { _id : req.body.id };
        const updateProfile = await Account.findOneAndUpdate(
            query,
            { bio: req.body.bio, }
        ).lean().exec();

        return res.status(200).json({ updateProfile, message: "Updated profile!" });
    } catch (err) {
        // Log any errors
        console.log(err);
        return res.status(500).json({error: 'Error editing profile'});
    }
}

module.exports = {
    profilePage,
    resetPass,
    getResetPass,
    getProfile,
    editProfile,
}