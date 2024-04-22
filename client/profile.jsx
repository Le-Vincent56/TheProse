const helper = require('./helper.js');
const profileHelper = require('./profileHelper.js');
const profileUI = require('./profileUI.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');
const {motion, AnimatePresence} = require('framer-motion');

let currentState;
let tags = [];

// Framer Variants
const backdrop = {
    visible: {opacity: 1},
    hidden: {opacity: 0}
}

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

    //TODO: SAVE POST?

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

const showFriendsModal = (e, setShowModal) => {
    // Show the modal
    setShowModal(true);
}

const hideFriendsModal = (e, setShowModal) => {
    // Hide the modal
    setShowModal(false);
}

const searchForUser = (e) => {

}

const ProfileHeader = (props) => {
    const [profile, setProfile] = useState(props.profile);

    useEffect(() => {
        const loadProfileFromServer = async () => {
            const username = document.querySelector('#content').className;
            const response = await fetch(`/getProfile?user=${username}`);
            const data = await response.json();
            setProfile(data.profile[0]);
        };
        loadProfileFromServer();
    }, [profile]);

    if(profile === undefined) {
        return (
            <div id='profile-header'>
                <div id='profile-username-display'>
                    <h1>User Not Found</h1>
                </div>
            </div>
        );
    } else{
        let parsedDate = new Date(profile.createdDate);
        let convertedMonth = parsedDate.toLocaleString('default', {month: 'long'});
        let dateString = `${convertedMonth} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`

        let bio = '';
        if(profile.bio === '') {
            bio = "[No Biography]"
        } else {
            bio = profile.bio;
        }

        // Return different UI for if the user is looking at their own vs. another profile
        if(profile.isCurrentUser) {
            return (
                <div id='profile-header'>
                    <div id='profile-edit-display'>
                        <div id='profile-edit-button'
                        onClick={(e) => startEditProfile(e)}>
                            <span id='profile-edit-text'>Edit Profile</span>
                        </div>
                    </div>
                    <div id='profile-account-details'>
                        <div id='profile-username-display'>
                            <h1 id='profile-username-text'>{profile.username}</h1>
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
                            <h1 id='profile-username-text'>{profile.username}</h1>
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

const PostList = (props) => {
    const [posts, setPosts] = useState(props.posts);

    useEffect(() => {
        const loadPostsFromServer = async () => {
            const username = document.querySelector('#content').className;
            const accountResponse = await fetch(`/getProfile?user=${username}`);
            const accountData = await accountResponse.json();

            const response = await fetch(`/getPosts?id=${accountData.profile[0]._id}`);
            const data = await response.json();
            setPosts(data.posts);
        };
        loadPostsFromServer();
    }, [props.reloadPosts]);

    // Present the appropriate HTML if there are no posts
    if(posts.length === 0) {
        return (
            <div className="post-list">
                <h3 className="empty-posts">No Posts Yet!</h3>
            </div>
        );
    }

    // Create a node for each post
    postNodes = posts.map(post => {
        // Create a genre string
        let genreString = "";
        for(let i = 0; i < post.genre.length; i++) {
            // Add each genre
            genreString += post.genre[i];

            // Add commas in between
            if(i !== post.genre.length - 1) {
                genreString += ", ";
            }
        }

        // Determine privacy
        const privacy = post.private ? "Private" : "Public";
        const privacyClass = `post-privacy ${privacy.toLowerCase()}`;
        let isPosted;
        if(post.private) {
            isPosted = false;
        } else {
            isPosted = true;
        }

        return(
            <div id={post.id} className="post-node"
                onClick={(e) => startEdit(e, isPosted)}>
                <div id={post.id} class="post-node-content">
                    <div id={post.id} class="post-header">
                        <h2 id={post.id} class="post-title">{post.title}</h2>
                        <p id={post.id} class={privacyClass}>{privacy}</p>
                    </div>
                    <div id={post.id} class="post-author">
                        <h4 id={post.id} class="post-author-text">By: {post.author}</h4>
                    </div>
                    <div id={post.id} class="post-hover-content">
                        <div id={post.id} class="post-genre">
                            <h4 id={post.id} class="post-genre-text">{genreString}</h4>
                        </div>
                        <div id={post.id} class="post-body-preview">
                            <p id={post.id} class="post-body-preview-text">{post.body.slice(0, 350)}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    });

    return(
        <div className="post-list">
            {postNodes}
        </div>
    );
};

const PostControls = (props) => {
    return(
        <div id="post-controls">
            <div id="control-cancel-post">
                <button id="cancel-post-button"
                    onClick={(e) => cancelPost(e)}
                >
                    CANCEL POST
                </button>
            </div>
        </div>
    );
}

const PostAreaControls = (props) => {
    return (
        <div id='post-area-controls'>
            <div id='control-add-post'>
                <p class='control-button'
                    onClick={(e) => startPost(e)}>
                    NEW POST
                </p>
            </div>
        </div>
    );
}

const PostArea = (props) => {
    return(
        <div id='post-area'>
            <div id='post-area-header'>
                <h1 id='post-area-header-text'>POSTS</h1>
            </div>
            <PostAreaControls/>
            <PostList posts={[]} reloadPosts={props.reloadPosts}/>
        </div>
    )
}

const FriendsAreaControls = (props) => {
    return (
        <div id='friends-area-controls'>
            <div id='control-add-friend'>
                <p class='control-button'
                    onClick={(e) => showFriendsModal(e, props.setShowModal)}>
                    ADD FRIEND
                </p>
            </div>
        </div>
    );
}

const FriendsModal = (props) => {
    return (
        <AnimatePresence>
            { props.showModal && (
                <motion.div className='backdrop'
                    variants={backdrop}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div className='friends-modal'>
                        <div className='friends-modal-header'>
                            <h1 className='friends-modal-header-text'>ADD FRIEND</h1>
                            <i className='material-symbols-outlined'
                            onClick={(e) => hideFriendsModal(e, props.setShowModal)}>close</i>
                        </div>
                        <div className='friends-modal-body'>
                            <input id='friend-search-input' type='text'
                            name='username-search' placeholder='SEARCH USERNAME' 
                            onChange={(e) => searchForUser(e)}/>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

const FriendsArea = (props) => {
    return (
        <div id='friends-area'>
            <FriendsModal showModal={props.showModal}
                setShowModal={props.setShowModal}/>
            <div id='friends-area-header'>
                <h1 id='friends-area-header-text'>FRIENDS</h1>
            </div>
            <FriendsAreaControls setShowModal={props.setShowModal}/>
        </div>
    )
}

const PostFormCreate = (props) => {
    return(
        <form class="form"
            onSubmit={(e) => {e.preventDefault();}}>
            <div class="form-content">
                <div class="form-header">
                    <div class="form-details-1">
                        <div class="form-detail-title">
                            <label for="title">TITLE</label>
                            <input id="title-input" name="title" placeholder="" 
                            type="text" class="form-input"/>
                        </div>

                        <div class="form-detail-author">
                            <label for="author">AUTHOR</label>
                            <input id="author-input" name="author" placeholder="" type="text" class="form-input"/>
                        </div>
                        
                    </div>
                    <div class="form-details-2">
                        <label for="genre">GENRE(S)</label>
                        <div class="genre-tag-container">
                            <input id="genre-input" name="genre" placeholder="" type="text"
                                onFocus={(e) => profileUI.applyBoxShadow(e)}
                                onBlur={(e) => profileUI.revertBoxShadow(e)}
                                onKeyUp={(e) => profileUI.createTagEvent(e, tags)}/>
                        </div>
                    </div>
                </div>

                <div class="form-body">
                    <div class="form-text-area">
                        <label for="body">BODY</label>
                        <textarea name="body" rows="40" placeholder="" class="body-area"></textarea>
                    </div>
                </div>

                <div class="form-footer">
                    <div class="form-save-btn"
                    onClick={(e) => {profileHelper.saveDraft(e)}}>
                        <p class="form-save-text">SAVE DRAFT</p>
                    </div>
                    <div class="form-post-btn"
                    onClick={(e) => {profileHelper.postWork(e)}}>
                        <p class="form-post-text">POST</p>
                    </div>
                </div>

                <div id='message-handler' class='hidden'>
                    <p id='message-text'></p>
                </div>
            </div>
        </form>
    );
}

const PostFormEdit = (props) => {
    return(
        <form class="form"
            onSubmit={(e) => {e.preventDefault();}}>
            <div class="form-content">
                <div class="form-header">
                    <div class="form-details-1">
                        <div class="form-detail-title">
                            <label for="title">TITLE</label>
                            <input id="title-input" name="title" placeholder="" 
                            type="text" class="form-input"/>
                        </div>

                        <div class="form-detail-author">
                            <label for="author">AUTHOR</label>
                            <input id="author-input" name="author" placeholder="" type="text" class="form-input"/>
                        </div>
                        
                    </div>
                    <div class="form-details-2">
                        <label for="genre">GENRE(S)</label>
                        <div class="genre-tag-container">
                            <input id="genre-input" name="genre" placeholder="" type="text"
                                onFocus={(e) => profileUI.applyBoxShadow(e)}
                                onBlur={(e) => profileUI.revertBoxShadow(e)}
                                onKeyUp={(e) => profileUI.createTagEvent(e, tags)}/>
                        </div>
                    </div>
                </div>

                <div class="form-body">
                    <div class="form-text-area">
                        <label for="body">BODY</label>
                        <textarea name="body" rows="40" placeholder="" class="body-area"></textarea>
                    </div>
                </div>

                <div class="form-footer">
                    <div class="form-save-btn"
                        onClick={(e) => {profileHelper.saveEdit(e, props.postData.id, false)}}>
                        <p class="form-save-text">SAVE DRAFT</p>
                    </div>
                    <div class="form-post-btn"
                        onClick={(e) => {profileHelper.postEdit(e, props.postData.id)}}>
                        <p class="form-post-text">POST</p>
                    </div>
                    <div class="form-delete-btn">
                        <p class="form-delete-text">DELETE</p>
                    </div>
                </div>

                <div id='message-handler' class='hidden'>
                    <p id='message-text'></p>
                </div>
            </div>
        </form>
    );
}

const PostFormPosted = (props) => {
    return(
        <form class="form"
            onSubmit={(e) => e.preventDefault()}>
            <div class="form-content">
                <div class="form-header">
                    <div class="form-details-1">
                        <div class="form-detail-title">
                            <label for="title">TITLE</label>
                            <input id="title-input" name="title" placeholder="" 
                            type="text" class="form-input"/>
                        </div>

                        <div class="form-detail-author">
                            <label for="author">AUTHOR</label>
                            <input id="author-input" name="author" placeholder="" type="text" class="form-input"/>
                        </div>
                        
                    </div>
                    <div class="form-details-2">
                        <label for="genre">GENRE(S)</label>
                        <div class="genre-tag-container">
                            <input id="genre-input" name="genre" placeholder="" type="text"
                                onFocus={(e) => profileUI.applyBoxShadow(e)}
                                onBlur={(e) => profileUI.revertBoxShadow(e)}
                                onKeyUp={(e) => profileUI.createTagEvent(e, tags)}/>
                        </div>
                    </div>
                </div>

                <div class="form-body">
                    <div class="form-text-area">
                        <label for="body">BODY</label>
                        <textarea name="body" rows="40" placeholder="" class="body-area"></textarea>
                    </div>
                </div>

                <div class="form-footer">
                    <div class="form-recall-btn"
                        onClick={(e) => {profileHelper.saveEdit(e, props.postData.id, false)}}>
                        <p class="form-recall-text">RECALL POST</p>
                    </div>
                    <div class="form-save-btn"
                        onClick={(e) => {profileHelper.saveEdit(e, props.postData.id, true)}}>
                        <p class="form-save-text">SAVE DRAFT</p>
                    </div>
                    <div class="form-delete-btn">
                        <p class="form-delete-text">DELETE</p>
                    </div>
                </div>

                <div id='message-handler' class='hidden'>
                        <p id='message-text'></p>
                </div>
            </div>
        </form>
    );
}

const ProfileEditorHead = (props) => {
    return(
        <div class='profile-form-header'>
            <div id="control-cancel-post">
                <div id="cancel-post-button"
                    onClick={(e) => cancelProfileEdit(e)}>
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

const LoadPage = (props) => {
    const [reloadPosts, setReloadPosts] = useState(false);
    const [showFriendsModal, setFriendsModal] = useState(false);

    useEffect(() => {
        // If editing a post, add the current data
        if(currentState === 2 || currentState === 3) {
            // Add title
            const title = document.querySelector('#title-input');
            title.value = value = props.postObj.title;

            // Add author
            const author = document.querySelector('#author-input');
            author.value = props.postObj.author;

            // Set tags
            tags = props.postObj.genre;
            profileUI.addTags(tags);

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
                    <ProfileHeader/>
                    <div id="profile-body">
                        <PostArea reloadPosts={reloadPosts}/>
                        <FriendsArea showModal={showFriendsModal}
                            setShowModal={setFriendsModal}/>
                    </div>
                </div>
            );

        // New post
        case 1:
            return(
                <div id="profile-new-post">
                    <PostControls/>
                    <PostFormCreate/>
                </div>
            );

        // Edit post draft
        case 2:
            return(
                <div id="profile-edit-post">
                    <PostControls/>
                    <PostFormEdit postData={props.postObj}/>
                </div>
            );

        // Edit posted post
        case 3:
            return(
                <div id="profile-posted-post">
                    <PostControls/>
                    <PostFormPosted postData={props.postObj}/>
                </div>
            );

        case 4:
            return(
                <div id="profile-editor">
                    <ProfileEditorHead/>
                    <ProfileEditor profileData={props.accountObj}/>
                </div>
            )
    }
};

const init = () => {
    // Set the current state to the profile home
    currentState = 0;
    
    // Load the page
    loadPage();
};

window.onload = init;