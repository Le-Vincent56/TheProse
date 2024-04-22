const React = require('react');
const profileHelper = require('../profileHelper.js');
const helper = require('../helper.js');

const ProfileEditorHeader = (props) => {
    return(
        <div class='profile-form-header'>
            <div id="control-cancel-post">
                <div id="cancel-post-button"
                    onClick={(e) => props.cancelProfileEdit(e)}>
                    <p>BACK</p>
                </div>
            </div>
            <div class='profile-form-label'>
                <h1 class='profile-form-label-text'>Edit Profile</h1>
            </div>
        </div>
    )
}

const ProfileEditor = (props) => {
    return(
        <form class='profile-form'
            onSubmit={(e) => e.preventDefault()}>
            <div class='profile-form-content'>
                <div class='profile-form-bio'>
                    <label for="bio">Biography</label>
                    <textarea name="bio" rows="20" placeholder="" class="bio-area"></textarea>
                </div>
            </div>
            <div class="profile-form-footer">
                <div class="profile-form-save-btn">
                    <p class="profile-form-save-text"
                    onClick={(e) => profileHelper.saveProfileChanges(e, props.profileData._id)}>
                        SAVE CHANGES
                    </p>
                </div>
                <div class='profile-form-resetpass-btn'
                onClick={(e) => {
                    helper.sendGet(`/getResetPass?user=${props.profileData.username}`, 
                    null)}}>
                    <p class="profile-form-resetpass-text">
                        RESET PASSWORD
                    </p>
                </div>
            </div>

            <div id='message-handler' class='hidden'>
                    <p id='message-text'></p>
            </div>
        </form>
    );
}

module.exports = {
    ProfileEditorHeader,
    ProfileEditor
}