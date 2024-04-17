const profilePage = (req, res) => res.render('profile');
const resetPass = (req, res) => res.render('resetpass');

module.exports = {
    profilePage,
    resetPass
}