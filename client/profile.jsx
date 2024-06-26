// Library and Helper imports
const profileUI = require('./profileUI.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

// Component imports
const helper = require('./helper.js');
const postFormComps = require('./components/postFormComps.js');
const postAreaComps = require('./components/postAreaComps.js');
const profileEditorComps = require('./components/profileEditorComps.js');
const friendsAreaComps = require('./components/friendsAreaComps.js');
const postReadComps = require('./components/postReadComps.js');

// Set React elements
const PostFormControls = postFormComps.PostFormHeader;
const PostFormEdit = postFormComps.PostFormEdit;
const PostFormCreate = postFormComps.PostFormCreate;
const PostFormPosted = postFormComps.PostFormPosted;
const PostArea = postAreaComps.PostArea;
const ProfileEditorHeader = profileEditorComps.ProfileEditorHeader;
const ProfileEditor = profileEditorComps.ProfileEditor;
const FriendsArea = friendsAreaComps.FriendsArea;
const PostReadHeader = postReadComps.PostReadHeader;
const PostRead = postReadComps.PostRead;

let currentState;
let tags = [];

const loadPage = () => {
    // Reset tags
    tags = [];

    // Reload the page
    const root = createRoot(document.getElementById('content'));
    root.render(<LoadPage currentState={currentState}/>);
}

const loadPageEdit = (editPostData) => {
    // Reload the page with an id to edit
    const root = createRoot(document.getElementById('content'));
    root.render(<LoadPage currentState={currentState} postObj={editPostData}/>);
}

const loadPageRead = (readPostData, isPosted, postID) => {
    const root = createRoot(document.getElementById('content'));
    root.render(<LoadPage currentState={currentState} postObj={readPostData}
                    isPosted={isPosted}/>);
}

const loadPageEditAccount = (editAccountData) => {
    // Reload the page with the username to edit the account for
    const root = createRoot(document.getElementById('content'));
    root.render(<LoadPage currentState={currentState} accountObj={editAccountData}/>);
}

const startPost = (e) => {
    // Set current state to adding a post
    currentState = 1;

    // Reload the page
    loadPage();
}

const cancelPost = (e) => {
    // Set current state to profile page
    currentState = 0;

    loadPage();
}

const cancelProfileEdit = (e) => {
    // Set current state to profile page
    currentState = 0;

    loadPage();
}

const startEdit = async (e, isPosted) => {
    // Get data
    const response = await fetch(`/getPost?id=${e.target.id}`);
    const data = await response.json();

    // Set current state to editing a post
    if(isPosted) {
        // Editing a posted post
        currentState = 3;
    } else {
        // Editing a drafted post
        currentState = 2;
    }

    // Load the edit page
    loadPageEdit(data.post[0]);
}

const startEditProfile = async (e) => {
    // Get profile
    const username = document.querySelector('#content').className;
    const response = await fetch(`/getProfile?user=${username}`);
    const data = await response.json();

    // Set the current state
    currentState = 4;

    // Load the edit account page
    loadPageEditAccount(data.profile[0]);
}

const togglePremium = (e, premium, onPremiumChanged) => {
    const newPremium = !premium;

    helper.sendPost('/updatePremium', {premium: newPremium}, onPremiumChanged);
    return false;
}

const readPost = async (e, postData, isPosted = false) => {
    // Get the post
    const owner = postData.owner;
    const postID = postData.id;
    const response = await fetch(`/getPost?id=${postID}&owner=${owner}`);
    const data = await response.json();

    // Set the current state to reading the post
    currentState = 5;

    loadPageRead(data.post[0], isPosted);
}

const checkPostState = async (e, owner, isPosted) => {
    if(isPosted) {
        readPost(e, {id: e.target.id, owner}, isPosted);
    } else {
        startEdit(e, isPosted);
    }
}

const PremiumButton = (props) => {
    if(props.premium) {
        return (
            <div id='profile-premium-button-active'
                onClick={(e) => togglePremium(e, props.premium, props.triggerReload)}>
                    <p>Deactivate Premium</p>
            </div>
        )
    } else {
        return (
            <div id='profile-premium-button-inactive'
                onClick={(e) => togglePremium(e, props.premium, props.triggerReload)}>
                    <p>Activate Premium</p>
            </div>
        )
    }
}

const ProfileHeader = (props) => {
    useEffect(() => {
        const loadProfileFromServer = async () => {
            const username = document.querySelector('#content').className;
            const response = await fetch(`/getProfile?user=${username}`);
            const data = await response.json();
            props.setProfile(data.profile[0]);
        };
        loadProfileFromServer();
    }, [props.reloadHeader]);

    if(props.profile === undefined) {
        return (
            <div id='profile-header'>
                <div id='profile-username-display'>
                    <h1>User Not Found</h1>
                </div>
            </div>
        );
    } else{
        let parsedDate = new Date(props.profile.createdDate);
        let convertedMonth = parsedDate.toLocaleString('default', {month: 'long'});
        let dateString = `${convertedMonth} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`

        let bio = '';
        if(props.profile.bio === '') {
            bio = "[No Biography]"
        } else {
            bio = props.profile.bio;
        }

        // Return different UI for if the user is looking at their own vs. another profile
        if(props.profile.isCurrentUser) {
            return (
                <div id='profile-header'>
                    <div id='profile-control-display'>
                        <div id='premium-btn-container'>
                            <PremiumButton premium={props.profile.premium} 
                            triggerReload={props.triggerReload}/>
                        </div>
                        <div id='profile-edit-button'
                        onClick={(e) => startEditProfile(e)}>
                            <span id='profile-edit-text'>Edit Profile</span>
                        </div>
                    </div>
                    <div id='profile-account-details'>
                        <div id='profile-username-display'>
                            <h1 id='profile-username-text'>{props.profile.username}</h1>
                        </div>
                        <div id='profile-bio-display'>
                            <p id='profile-bio-text'>{bio}</p>
                        </div>
                        <div id='profile-date-display'>
                            <p id='profile-date-text'>Joined {dateString}</p>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div id='profile-header'>
                    <div id='profile-account-details'>
                        <div id='profile-username-display'>
                            <h1 id='profile-username-text'>{props.profile.username}</h1>
                        </div>
                        <div id='profile-bio-display'>
                            <p id='profile-bio-text'>{bio}</p>
                        </div>
                        <div id='profile-date-display'>
                            <p id='profile-date-text'>Joined {dateString}</p>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

const LoadPage = (props) => {
    const [reloadHeader, setReloadHeader] = useState(false);
    const [reloadPosts, setReloadPosts] = useState(false);
    const [reloadFriends, setReloadFriends] = useState(false);
    const [showFriendsModal, setFriendsModal] = useState(false);
    const [profile, setProfile] = useState({});
    const [genreTags, setTags] = useState(tags);

    useEffect(() => {
        // If editing a post, add the current data
        if(currentState === 2 || currentState === 3) {
            // Add title
            const title = document.querySelector('#title-input');
            title.value = props.postObj.title;

            // Add author
            const author = document.querySelector('#author-input');
            author.value = props.postObj.author;

            // Set tags
            tags = props.postObj.genre;
            profileUI.addTags(tags);
            setTags(tags);

            // Add body
            const body = document.querySelector('.body-area');
            body.value = props.postObj.body;
        } else if(currentState == 4) {
            // If editing a profile, autofill the data
            const bio = document.querySelector('.bio-area');
            bio.value = props.accountObj.bio;
        }
    })

    // Check which page to display
    switch(props.currentState) {
        // Profile body
        case 0:
            return(
                <div id="profile">
                    <ProfileHeader profile={profile} setProfile={setProfile}
                    reloadHeader={reloadHeader} triggerReload={() => setReloadHeader(!reloadHeader)}/>
                    <div id="profile-body">
                        <PostArea profile={profile} readPost={readPost} checkPostState={checkPostState}
                            startPost={startPost} startEdit={startEdit} reloadPosts={reloadPosts}/>
                        <FriendsArea profile={profile}
                            showModal={showFriendsModal}
                            setShowModal={setFriendsModal} reloadFriends={reloadFriends}
                            triggerReload={() => setReloadFriends(!reloadFriends)}/>
                    </div>
                </div>
            );

        // New post
        case 1:
            return(
                <div id="profile-new-post">
                    <PostFormControls cancelPost={cancelPost}/>
                    <PostFormCreate tags={genreTags}/>
                </div>
            );

        // Edit post draft
        case 2:
            return(
                <div id="profile-edit-post">
                    <PostFormControls cancelPost={cancelPost}/>
                    <PostFormEdit tags={genreTags} postData={props.postObj}/>
                </div>
            );

        // Edit posted post
        case 3:
            return(
                <div id="profile-posted-post">
                    <PostFormControls cancelPost={cancelPost}/>
                    <PostFormPosted tags={genreTags} postData={props.postObj}/>
                </div>
            );

        // Edit profile
        case 4:
            return(
                <div id="profile-editor">
                    <ProfileEditorHeader cancelProfileEdit={cancelProfileEdit}/>
                    <ProfileEditor profileData={props.accountObj}/>
                </div>
            );

        // Read post
        case 5:
            return (
                <div id="profile-read-post">
                    <PostReadHeader postData={props.postObj} backButton={cancelPost}
                        editPost={startEdit} isPosted={props.isPosted}/>
                    <PostRead postData={props.postObj}/>
                </div>
            );
    }
};

const init = () => {
    // Set the current state to the profile home
    currentState = 0;
    
    // Load the page
    loadPage();
};

window.onload = init;