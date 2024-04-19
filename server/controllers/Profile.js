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
const resetPass = (req, res) => res.render('resetpass');
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

module.exports = {
    profilePage,
    resetPass,
    getProfile,
}