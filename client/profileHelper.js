const helper = require('./helper.js');

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
    return false;
}

const saveProfileChanges = (e, accountID) => {
    // Prevent default events
    e.preventDefault();

    // Collect changed data
    const accountBio = document.querySelector('.bio-area').value;
    const accountData = {
        id: accountID,
        bio: accountBio,
    }

    helper.sendPost('/editProfile', accountData);
    return false;
}

const deletePost = (e, postID) => {
    // Prevent default events
    e.preventDefault();

    helper.sendPost('/deletePost', {postID});
    return false;
}

module.exports = {
    collectData,
    postWork,
    postEdit,
    saveDraft,
    saveEdit,
    saveProfileChanges,
    deletePost,
}