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

const startEdit = async (e) => {
    // Get data
    const response = await fetch(`/getPost?id=${e.target.id}`);
    const data = await response.json();

    // Set current state to editing a post
    currentState = 2;

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

const postWork = (e, onPostAdded) => {
    e.preventDefault();
    
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

    if(!title || !author || !postTags || !body) {
        // SEND ERROR
        console.log("Missing fields");
        return false;
    }

    // Assemble the object
    const postData = {
        title: title,
        author: author,
        genre: postTags,
        body: body
    };

    // Post the post
    helper.sendPost('/postWork', postData, onPostAdded);
    return false;
}

const PostList = (props) => {
    const [posts, setPosts] = useState(props.posts);

    useEffect(() => {
        const loadPostsFromServer = async () => {
            const response = await fetch('/getPosts');
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

        return(
            <div id={post.id} className="post-node"
                onClick={(e) => startEdit(e)}>
                <div id={post.id} class="post-node-content">
                    <h2 id={post.id} class="post-title">{post.title}</h2>
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
            </div>
        </div>
    )
    
    
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
                    <button class="form-save-btn">SAVE DRAFT</button>
                    <button class="form-post-btn"
                    onClick={(e) => {postWork(e, props.triggerReload)}}>POST</button>
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
                    <button class="form-save-btn">SAVE DRAFT</button>
                    <button class="form-post-btn"
                    onClick={(e) => {postWork(e, props.triggerReload)}}>POST</button>
                    <button class="form-delete-btn">DELETE</button>
                </div>
            </div>
        </form>
    );
}

const LoadPage = (props) => {
    const [reloadPosts, setReloadPosts] = useState(false);

    useEffect(() => {
        // If editing, add the current data
        if(currentState === 2) {
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
        }
    })

    // Check which page to display
    switch(props.currentState) {
        // Profile body
        case 0:
            return(
                <div id="profile-body">
                    <PostList posts={[]} reloadPosts={reloadPosts}/>
                    <ProfileControls/>
                </div>
            );

        // New post
        case 1:
            return(
                <div id="profile-new-post">
                    <PostControls/>
                    <PostFormCreate triggerReload={() => setReloadPosts(!reloadPosts)}/>
                </div>
            );

        // Edit post
        case 2:
            return(
                <div id="profile-edit-post">
                    <PostControls/>
                    <PostFormEdit postData={props.postData} triggerReload={() => setReloadPosts(!reloadPosts)}/>
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