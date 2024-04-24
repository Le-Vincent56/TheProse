const React = require('react');
const {useState, useEffect} = React;

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

        // Check if current user
        if(props.profile.isCurrentUser) {
            return(
                <div id={post.id} className="post-node"
                    onClick={(e) => props.startEdit(e, isPosted)}>
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
        } else {
            return(
                <div className="post-node">
                    <div class="post-node-content">
                        <div class="post-header">
                            <h2 class="post-title">{post.title}</h2>
                            <p class={privacyClass}>{privacy}</p>
                        </div>
                        <div class="post-author">
                            <h4 class="post-author-text">By: {post.author}</h4>
                        </div>
                        <div class="post-hover-content">
                            <div class="post-genre">
                                <h4 class="post-genre-text">{genreString}</h4>
                            </div>
                            <div class="post-body-preview">
                                <p class="post-body-preview-text">{post.body.slice(0, 350)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        
    });

    return(
        <div className="post-list">
            {postNodes}
        </div>
    );
};

const PostAreaControls = (props) => {
    return (
        <div id='post-area-controls'>
            <div id='control-add-post'>
                <p class='control-button'
                    onClick={(e) => props.startPost(e)}>
                    NEW POST
                </p>
            </div>
        </div>
    );
}

const PostArea = (props) => {
    if(props.profile.isCurrentUser) {
        return(
            <div id='post-area'>
                <div id='post-area-header'>
                    <h1 id='post-area-header-text'>POSTS</h1>
                </div>
                <PostAreaControls startPost={props.startPost}/>
                <PostList profile={props.profile}
                startEdit={props.startEdit} posts={[]} reloadPosts={props.reloadPosts}/>
            </div>
        )
    } else {
        return(
            <div id='post-area'>
                <div id='post-area-header'>
                    <h1 id='post-area-header-text'>POSTS</h1>
                </div>
                <PostList profile={props.profile}
                startEdit={props.startEdit} posts={[]} reloadPosts={props.reloadPosts}/>
            </div>
        )
    }
}

module.exports = {
    PostArea
}