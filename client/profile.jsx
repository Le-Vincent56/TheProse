const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');
const {motion} = require('framer-motion');

let currentState;
let tags = [];

const applyBoxShadow = (e) => {
    const tagContainer = document.querySelector('.genre-tag-container');
    tagContainer.style.outline = 'none';
    tagContainer.style.border = '0.5px solid black';
    tagContainer.style.boxShadow = '-5px -5px 0px #07031A';
    tagContainer.style.backgroundColor = '#F4F6FF';
}

const revertBoxShadow = (e) => {
    const tagContainer = document.querySelector('.genre-tag-container');
    tagContainer.style = "";
}

const createTag = (label) => {
    // Set class to tag
    const div = document.createElement('div');
    div.setAttribute('class', 'tag');

    // Set the tag label
    const span = document.createElement('span');
    span.innerHTML = label;

    // Set the X close button
    const closeBtn = document.createElement('i');
    closeBtn.setAttribute('class', 'material-symbols-outlined');
    closeBtn.setAttribute('data-item', label);
    closeBtn.innerHTML = 'close';

    // Set event for close button
    closeBtn.addEventListener('click', (e) => {
        // Get the stored tag and the index within the array
        const tag = e.target.getAttribute('data-item');
        const index = tags.indexOf(tag);

        // remove the tag from the array
        tags = [...tags.slice(0, index), ...tags.slice(index + 1)];

        // Reload the tags
        addTags();
    });

    // Append the children to the div
    div.appendChild(span);
    div.appendChild(closeBtn);

    return div;
}

const createTagEvent = (e) => {
    if(e.key === 'Enter') {
        // Sanitizer and store the tag
        const tagToAdd = e.target.value.trim();

        // If the tag is already included, return
        if(
            tags.includes(tagToAdd) ||
            tags.includes(tagToAdd.toUpperCase()) ||
            tags.includes(tagToAdd.toLowerCase())
        ) return;

        // Add the tag to the list
        tags.push(tagToAdd);
        addTags();

        // Reset the input value
        e.target.value = '';
    }
}

const resetTags = () => {
    // Remove all .tag class elements
    document.querySelectorAll('.tag').forEach((tag) => {
        tag.parentElement.removeChild(tag);
    });
}

const addTags =() => {
    // Reset tags
    resetTags();

    // Add a tag for each tag in the tags array
    // Using .slice().reverse() to put in the right order
    tags.slice().reverse().forEach((tag) => {
        const input = createTag(tag);
        const tagContainer = document.querySelector('.genre-tag-container');
        tagContainer.prepend(input);
    });
}

const loadPage = () => {
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

const collectData = () => {
    // Gather post details
    const title = document.querySelector('#title-input').value;
    const author = document.querySelector('#author-input').value;

    // Gather genre tags
    const postTags = [];
    const tagContainers = document.querySelectorAll('.tag');
    for(const tagContainer of tagContainers) {
        postTags.push(tagContainer.querySelector('span').innerHTML);
    }

    // Reset tags
    tags = [];

    // Get body text
    const body = document.querySelector('.body-area').value;

    // Check if all the fields are filled
    if(!title || !author || !postTags || !body) {
        // Send error
        console.log("Missing fields");
        return false;
    }

    // Assemble the object
    const postData = {
        title: title,
        author: author,
        genre: postTags,
        body: body,
    };

    return postData;
}

const postWork = (e) => {
    // Prevent default events
    e.preventDefault();
    
    // Collect the post data
    const postData = collectData();

    // Set the post to public
    postData.private = false;

    // Post the post
    helper.sendPost('/postWork', postData);
    return false;
}

const postEdit = (e, postID) => {
    // Prevent default events
    e.preventDefault();
    
    // Collect the post data
    const postData = collectData();
    postData.id = postID;

    // Set the post to public
    postData.private = false;

    // Post the post
    helper.sendPost('/editPost', postData);
    return false;
}

const saveDraft = (e) => {
    // Prevent default events
    e.preventDefault();

    // Collect the post data
    const postData = collectData();

    // Set the post to private
    postData.private = true;

    // Post the post
    helper.sendPost('/saveDraft', postData);
    return false;
}

const saveEdit = (e, postID, isPosted) => {
    // Prevent default events
    e.preventDefault();

    // Collect post data
    const postData = collectData();
    postData.id = postID;

    // Set whether or not the post is private
    if(isPosted) {
        postData.private = false;
    } else {
        postData.private = true;
    }

    // Post the post
    helper.sendPost('/editPost', postData);
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
                            <p id={post.id} class="post-body-preview-text">{post.body.slice(0, 250)}</p>
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

const ProfileControls = (props) => {
    return(
        <div id="profile-controls">
            <div id="control-add-post">
                <button id="add-post-button"
                    onClick={(e) => startPost(e)}
                >
                    NEW POST
                </button>
                <a id="reset-pass-button" href='/resetpass'>
                    RESET PASSWORD
                </a>
            </div>
        </div>
    );
}

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
                                onFocus={(e) => applyBoxShadow(e)}
                                onBlur={(e) => revertBoxShadow(e)}
                                onKeyUp={(e) => createTagEvent(e)}/>
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
                    onClick={(e) => {saveDraft(e)}}>
                        <p class="form-save-text">SAVE DRAFT</p>
                    </div>
                    <div class="form-post-btn"
                    onClick={(e) => {postWork(e)}}>
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
                                onFocus={(e) => applyBoxShadow(e)}
                                onBlur={(e) => revertBoxShadow(e)}
                                onKeyUp={(e) => createTagEvent(e)}/>
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
                        onClick={(e) => {saveEdit(e, props.postData.id, false)}}>
                        <p class="form-save-text">SAVE DRAFT</p>
                    </div>
                    <div class="form-post-btn"
                        onClick={(e) => {postEdit(e, props.postData.id)}}>
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
                                onFocus={(e) => applyBoxShadow(e)}
                                onBlur={(e) => revertBoxShadow(e)}
                                onKeyUp={(e) => createTagEvent(e)}/>
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
                        onClick={(e) => {saveEdit(e, props.postData.id, false)}}>
                        <p class="form-recall-text">RECALL POST</p>
                    </div>
                    <div class="form-save-btn"
                        onClick={(e) => {saveEdit(e, props.postData.id, true)}}>
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
                    CANCEL POST
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
                    <textarea name="bio" rows="40" placeholder="" class="bio-area"></textarea>
                </div>
            </div>
            <div class="profile-form-footer">
                <div class="profile-form-save-btn">
                    <p class="profile-form-save-text">SAVE DRAFT</p>
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
            addTags();

            // Add body
            const body = document.querySelector('.body-area');
            body.value = props.postObj.body;
        } else if(currentState == 4) {
            // If editing a profile, autofill the data
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
                        <PostList posts={[]} reloadPosts={reloadPosts}/>
                        <ProfileControls/>
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
                <div id="profile">
                    <ProfileEditorHead/>
                    <ProfileEditor/>
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