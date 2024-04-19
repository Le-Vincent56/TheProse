// Imports
const url = require('url');
const query = require('querystring');
const models = require('../models');
const { Account } = models;

const profilePage = (req, res) => res.render('profile');
const resetPass = (req, res) => res.render('resetpass');
const getProfile = async (req, res) => {
    const parsedURL = url.parse(req.url);
    const params = query.parse(parsedURL.query);

    // Check if a query exists
    if(params.user === null || params.user === undefined) {
        // If not, load the user's page
        try {
            const query = { owner: req.session.account._id };
            const docs = await Account.find(query).select('username bio createdDate').lean().exec();

            return res.json({profile: docs});
        } catch (err) {
            // Log any errors
            console.log(err);
            return res.status(500).json({error: 'Error receiving profile'});
        }
    } else {
        // Otherwise, load another's page
        try {
            const query = {username: params.user};
            const docs = await Account.find(query).select('username bio createdDate').lean().exec();

            return res.json({profile: docs});
        } catch (err) {
            // Log any errors
            console.log(err);
            return res.status(500).json({error: 'Error receiving profile'});
        }
    }
}

module.exports = {
    profilePage,
    resetPass,
    getProfile,
}