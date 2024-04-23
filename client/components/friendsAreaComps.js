const React = require('react');
const {useState, useEffect} = React;
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

const searchForUser = async (e, setSearchedFriends) => {
    const loadProfilesFromServer = async () => {
        const username = e.target.value;
        const response = await fetch(`/searchProfiles?user=${username}`);
        const data = await response.json();
        setSearchedFriends(data.profiles);
    };
    loadProfilesFromServer();
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

const FriendsSearchList = (props) => {
    if(props.searchedFriends.length === 0) {
        return (
            <div className='friends-search-results-container'>
                <h3 className='empty-search'>No Users Found</h3>
            </div>
        );
    }

    const friendNodes = props.searchedFriends.map(user => {
        // Parse the date into a readable string
        let parsedDate = new Date(user.createdDate);
        let convertedMonth = parsedDate.toLocaleString('default', {month: 'long'});
        let dateString = `${convertedMonth} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`

        return (
            <div className='search-node'>
                <div className='search-node-details'>
                    <p className='search-node-username'>{user.username}</p>
                    <p className='search-node-date'>{dateString}</p>
                </div>
                <div className='add-friend-container'>
                    <div className="add-friend-btn">
                        <p className="add-friend-btn-text">ADD</p>
                    </div>
                </div>
            </div>
        );
    });

    return(
        <div className='friends-search-results-container'>
            {friendNodes}
        </div>
    );
}

const FriendsModal = (props) => {
    const [searchedFriends, setSearchedFriends] = useState(props.searchedFriends);

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
                            <div className='friends-search-input-container'>
                                <input id='friend-search-input' type='text'
                                name='username-search' placeholder='SEARCH USERNAME' 
                                onChange={(e) => searchForUser(e, setSearchedFriends)}/>
                            </div>
                            <FriendsSearchList searchedFriends={searchedFriends}/>
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
            <FriendsModal searchedFriends={[]} showModal={props.showModal}
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