const React = require('react');
const profileHelper = require('../profileHelper.js');
const helper = require('../helper.js');

const trackCharacters = (e, maximum) => {
    // Get the current value
    const currentString = e.target.value;
    const length = currentString.length;

    // Stop after hitting the maximum character count
    if(length > maximum) {
        e.target.value = currentString.substring(0, maximum);
    }

    // Update counter
    document.querySelector('#num-count').innerHTML = `${e.target.value.length}/100`;
}

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
                    <div id='profile-bio-input'>
                        <textarea name="bio" rows="10" placeholder="" class="bio-area"
                        maxlength="100"
                        onChange={(e) => trackCharacters(e, 100)}></textarea>
                        <p id='num-count'>0/100</p>
                    </div>
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