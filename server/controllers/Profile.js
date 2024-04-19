// Imports
const url = require('url');
const query = require('querystring');
const models = require('../models');
const { Account } = models;

const profilePage = (req, res) => {
    const username = req.session.account.username;

    if(req.session.account.username) {
        res.render('profile', {username: username});
    }
};
const resetPass = (req, res) => res.render('resetpass');
const getProfile = async (req, res) => {
    const parsedURL = url.parse(req.url);
    const params = query.parse(parsedURL.query);

    try {
        const query = { username: params.user };
        const docs = await Account.find(query).select('username bio createdDate').lean().exec();
        console.log(JSON.stringify(docs));
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