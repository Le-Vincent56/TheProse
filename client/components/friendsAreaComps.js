const React = require('react');
const {motion, AnimatePresence} = require('framer-motion');

// Framer Variants
const backdrop = {
    visible: {opacity: 1},
    hidden: {opacity: 0}
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

module.exports = {
    FriendsArea,
}