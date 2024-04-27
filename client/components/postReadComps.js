const React = require('react');
const {useState, useEffect, useRef} = React;
const {motion, useScroll, useSpring} = require('framer-motion');

const PostReadControls = (props) => {
    if(props.postData.isCurrentUser) {
        return (
            <div id='post-read-controls'>
                <div id='back-btn-container'>
                    <div id="back-btn"
                    onClick={(e) => props.backButton(e)}
                    >
                        <p className='back-btn-text'>BACK</p>
                    </div>
                </div>
                <div id={props.postData.id} className='edit-btn-container'>
                    <div id={props.postData.id} className='edit-btn'
                    onClick={(e) => props.editPost(e, props.isPosted)}>
                        <p id={props.postData.id} className='edit-btn-text'>EDIT</p>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div id='post-read-controls'>
                <div id='back-btn-container'>
                    <div id="back-btn"
                            onClick={(e) => props.backButton(e)}
                    >
                        <p className='back-btn-text'>BACK</p>
                    </div>
                </div>
            </div>
        )
    }
}

const PostReadHeader = (props) => {
    useEffect(() => {
        const genres = document.querySelector('#post-genres');

        // Create an initial genres line
        let currentLine = 1;
        const beginLine = document.createElement('div');
        beginLine.setAttribute('class', `genre-line`);
        beginLine.setAttribute('id', 'genre-line-1');
        genres.appendChild(beginLine);

        // Set the target to the current first genre line
        let currentTarget = document.querySelector('#genre-line-1');

        for(let i = 1; i <= props.postData.genre.length; i++) {
            // Create the tag
            const tag = document.createElement('div');
            tag.setAttribute('class', 'post-read-genre-container');

            // Create the label
            const label = document.createElement('p');
            label.setAttribute('class', 'post-read-genre-text');
            label.innerHTML = props.postData.genre[i - 1];

            // Append the label to the tag, and the tag
            // to the current genre line
            tag.appendChild(label);
            currentTarget.appendChild(tag);

            // Check to create a new line
            if(i % 5 === 0) {
                // Increment the line number
                currentLine++;

                // Create the new line and append to the genres div
                const newLine = document.createElement('div');
                newLine.setAttribute('class', `genre-line`);
                newLine.setAttribute('id', `genre-line-${currentLine}`);
                genres.appendChild(newLine);

                // Set the new target
                currentTarget = document.querySelector(`#genre-line-${currentLine}`);
            }
        }

        // Set the body text
        document.querySelector('#post-read-body-text').value = props.postData.body;
    });

    return(
        <div id="post-read-header">
            <PostReadControls postData={props.postData} editPost={props.editPost} 
            isPosted={props.isPosted} backButton={props.backButton}/>
            <div id='post-title-label'>
                <h1 id='post-title-text'>{props.postData.title}</h1>
            </div>
            <div id='post-subtitle-label'>
                <h3 id='post-subtitle-text'>By {props.postData.author}</h3>
            </div>
            <div id='post-genres'>

            </div>
        </div>
    );
}

const PostRead = (props) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({container: ref});
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return(
        <div id="post-read-body">
            <motion.div className='progress-bar' style={{ scaleX }}/>
            <textarea ref={ref} id='post-read-body-text' disabled='true'></textarea>
        </div>
    );
}

module.exports = {
    PostReadHeader,
    PostRead,
}