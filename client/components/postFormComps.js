const React = require('react');
const profileHelper = require('../profileHelper.js');
const profileUI = require('../profileUI.js');

const PostFormControls = (props) => {
    return(
        <div id="post-controls">
            <div id="control-cancel-post">
                <button id="cancel-post-button"
                    onClick={(e) => props.cancelPost(e)}
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
                                onFocus={(e) => profileUI.applyBoxShadow(e)}
                                onBlur={(e) => profileUI.revertBoxShadow(e)}
                                onKeyUp={(e) => profileUI.createTagEvent(e, props.tags)}/>
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
                                onKeyUp={(e) => profileUI.createTagEvent(e, props.tags)}/>
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
                                onKeyUp={(e) => profileUI.createTagEvent(e, props.tags)}/>
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

module.exports ={
    PostFormControls,
    PostFormCreate,
    PostFormPosted,
    PostFormEdit,
}