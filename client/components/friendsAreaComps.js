const React = require('react');
const {useState, useEffect} = React;
const {motion, AnimatePresence} = require('framer-motion');
const helper = require('../helper.js');

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

const addFriend = async (e, userID, triggerReload, triggerSearchReload) => {
    const onAccountAdded = (result) => {
        triggerReload(result);
        triggerSearchReload(result);
    }
    helper.sendPost('/addFriend', {accountID: userID}, onAccountAdded);
    return false;
}

const removeFriend = async (e, userID, onAccountRemoved) => {
    helper.sendPost('/removeFriend', {accountID: userID}, onAccountRemoved);
    return false;
}

const goToProfile = async (e, username) => {
    helper.sendGet(`/redirectProfile?user=${username}`, null);
    return false;
}

const changeFriendsTab = async (e, setTab, tabToSet, onTabChange) => {
    // Change tabs
    setTab(tabToSet);
    onTabChange();

    const setStyleClasses = (self, allyNum, otherLabel, otherNum) => {
        self.classList.add('selected');
        self.classList.remove('tab-link');

        allyNum.classList.add('selected-num');
        allyNum.classList.remove('unselected-num');

        otherLabel.classList.add('tab-link');
        otherLabel.classList.remove('selected');

        otherNum.classList.add('unselected-num');
        otherNum.classList.remove('selected-num');
    }

    // Change classes
    if(tabToSet) {
        // Set following to selected
        const allyNum = document.querySelector('#friends-following-num');
        const otherLabel = document.querySelector('#friends-followers-label');
        const otherNum = document.querySelector('#friends-followers-num');
        setStyleClasses(e.target, allyNum, otherLabel, otherNum);
    } else {
        // Set followers to selected
        const allyNum = document.querySelector('#friends-followers-num');
        const otherLabel = document.querySelector('#friends-following-label');
        const otherNum = document.querySelector('#friends-following-num');
        setStyleClasses(e.target, allyNum, otherLabel, otherNum);
    }

    return false;
}

const decideNodeAction = async (e, username, userID, onAccountRemoved) => {
    // Choose which action to do depending on the element clicked
    if(e.target.className === 'remove-friend-container' ||
        e.target.className === 'remove-friend-btn' ||
        e.target.className === 'remove-friend-btn-text') {
        removeFriend(e, userID, onAccountRemoved);
    } else {
        goToProfile(e, username);
    }

    return false;
}

const FriendsAreaHeader = (props) => {
    useEffect(() => {
        const getFriendData = async () => {
            const response = await fetch(
                `/getFriendData?user=${props.profile.username}`
            );
            const data = await response.json();

            // Return in case of running before profile is retrieved
            if(data.friends.length === 0) return;

            // Set follower data
            const followers = document.querySelector(
                '#friends-followers-num'
            );
            followers.innerHTML = data.friends[0].followers.length;

            // Set following data
            const following = document.querySelector(
                '#friends-following-num'
            );
            following.innerHTML = data.friends[0].friends.length;
        }
        getFriendData();
    }, [props.profile, props.reloadFriends]);

    return (
        <div id='friends-area-header'>
            <div id='friends-area-header-label'>
                <h1 id='friends-area-header-text'>FRIENDS</h1>
            </div>

            <div id='friends-following-area'>
                <h3 id='friends-following-label' class='tab-link selected'
                onClick={(e) => changeFriendsTab(e, props.setTab, true, props.triggerReload)}>
                    FOLLOWING
                </h3>
                <h3 class='selected-num'id='friends-following-num'>0</h3>
            </div>

            <div id='friends-followers-area'>
                <h3 id='friends-followers-label' class='tab-link'
                onClick={(e) => changeFriendsTab(e, props.setTab, false, props.triggerReload)}>
                    FOLLOWERS
                </h3>
                <h3 class='unselected-num' id='friends-followers-num'>0</h3>
            </div>
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

const AddFriendButton = (props) => {
    if(props.profile.isFriend) {
        return (
            <div className='add-friend-container'>
                <div className="add-friend-btn-disabled">
                    <p className="add-friend-btn-text">ADDED</p>
                </div>
            </div>
        )
    }
    
    return (
        <div className='add-friend-container'>
            <div className="add-friend-btn"
            onClick={(e) => addFriend(e, props.profile._id, 
                props.triggerReload, props.triggerSearchReload)}>
                <p className="add-friend-btn-text">ADD</p>
            </div>
        </div>
    );
}

const FriendsSearchList =  (props) => {
    const [reloadSearchedFriends, setReload] = useState(false);

    useEffect(() => {
        const loadProfilesFromServer = async () => {
            const username = document.querySelector('#friend-search-input').value;
            const response = await fetch(`/searchProfiles?user=${username}`);
            const data = await response.json();
            props.setSearchedFriends(data.profiles);
        };
        loadProfilesFromServer();
    }, [reloadSearchedFriends]);

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
        let dateString = `${convertedMonth} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`;

        return (
            <div className='search-node'>
                <div className='search-node-details'>
                    <p className='search-node-username'>{user.username}</p>
                    <p className='search-node-date'>{dateString}</p>
                </div>
                <AddFriendButton profile={user} triggerReload={props.triggerReload}
                triggerSearchReload={() => setReload(!reloadSearchedFriends)}/>
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
                    exit="hidden"
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
                            <FriendsSearchList searchedFriends={searchedFriends} 
                            setSearchedFriends={setSearchedFriends} 
                            triggerReload={props.triggerReload}/>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

const FriendsList = (props) => {
    const [friends, setFriends] = useState(props.friends);
    const [followers, setFollowers] = useState(props.followers);

    useEffect(() => {
        const loadFriendDataFromServer = async () => {
            // Load in the user's friends
            const username = props.profile.username;
            const response = await fetch(`/getFriends?user=${username}`);
            const data = await response.json();
            
            // Prevent early loading
            if(data.profile.length === 0) return;

            // Store as a local friend ID array to be used later in the function
            const localFriendIDs = data.profile[0].friends;

            // Create and fill the friends array with friend profile data
            let friendsArray = [];
            for(const friendID of localFriendIDs) {
                const response = await fetch(`/getProfile?id=${friendID}`);
                const data = await response.json();
                friendsArray.push(data.profile[0]);
            }

            // Set friends array
            setFriends(friendsArray);
        }

        const loadFollowerDataFromServer = async () => {
            // Load in the user's followers
            const username = props.profile.username;
            const response = await fetch(`/getFollowers?user=${username}`);
            const data = await response.json();

            // Prevent early loading
            if(data.profile.length === 0) return;

            // Store as a local follower ID array to be used later in the function
            const localFollowerIDs = data.profile[0].followers;

            // Create and fill the friends array with friend profile data
            let followersArray = [];
            for(const followerID of localFollowerIDs) {
                const response = await fetch(`/getProfile?id=${followerID}`);
                const data = await response.json();
                followersArray.push(data.profile[0]);
            }

            // Set followers array
            setFollowers(followersArray);
        }

        // Load friend and follower data
        loadFriendDataFromServer();
        loadFollowerDataFromServer();
    }, [props.profile, props.reloadFriends]);

    let friendNodes;
    if(props.currentTab) {
        if(friends.length === 0) {
            return (
                <div className="friends-list">
                    <h3 className="empty-friends">No Friends Yet!</h3>
                </div>
            );
        }

        // Create a node for each friend
        friendNodes = friends.map(friend => {
            if(props.profile.isCurrentUser) {
                return(
                    <div id={friend._id} className="friend-node"
                    onClick={(e) => decideNodeAction(e, friend.username, 
                                        friend._id, props.triggerReload)}>
                        <div id={friend._id} class="friend-node-content">
                            <div id={friend._id} class="friend-node-details">
                                <h2 id={friend._id} class="friend-username">{friend.username}</h2>
                            </div>
                            <div id={friend._id} className='remove-friend-container'>
                                <div id={friend._id} className="remove-friend-btn">
                                    <p id={friend._id} className="remove-friend-btn-text">REMOVE</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return(
                    <div id={friend._id} className="friend-node"
                    onClick={(e) => decideNodeAction(e, friend.username, 
                                        friend._id, props.triggerReload)}>
                        <div id={friend._id} class="friend-node-content">
                            <div id={friend._id} class="friend-node-details">
                                <h2 id={friend._id} class="friend-username">{friend.username}</h2>
                            </div>
                        </div>
                    </div>
                )
            }
        });
    } else {
        if(followers.length === 0) {
            return (
                <div className="friends-list">
                    <h3 className="empty-friends">No Followers Yet!</h3>
                </div>
            );
        }

        // Create a node for each follower
        friendNodes = followers.map(friend => {
            if(props.profile.isCurrentUser) {
                return(
                    <div id={friend._id} className="friend-node"
                    onClick={(e) => decideNodeAction(e, friend.username, 
                                        friend._id, props.triggerReload)}>
                        <div id={friend._id} class="friend-node-content">
                            <div id={friend._id} class="friend-node-details">
                                <h2 id={friend._id} class="friend-username">{friend.username}</h2>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return(
                    <div id={friend._id} className="friend-node"
                    onClick={(e) => decideNodeAction(e, friend.username, 
                                        friend._id, props.triggerReload)}>
                        <div id={friend._id} class="friend-node-content">
                            <div id={friend._id} class="friend-node-details">
                                <h2 id={friend._id} class="friend-username">{friend.username}</h2>
                            </div>
                        </div>
                    </div>
                )
            }
        });
    }

    return(
        <div className="friends-list">
            {friendNodes}
        </div>
    );
}

const FriendsArea = (props) => {
    const [profile, setProfile] = useState(props.profile);
    const [currentTab, setTab] = useState(true);

    useEffect(() => {
        setProfile(props.profile);
    }, [props.profile]);

    if(profile.isCurrentUser) {
        return (
            <div id='friends-area'>
                <FriendsModal searchedFriends={[]} showModal={props.showModal}
                    setShowModal={props.setShowModal} triggerReload={props.triggerReload}/>
                <FriendsAreaHeader profile={profile} 
                setTab={setTab} currentTab={currentTab}
                friendData={[]} reloadFriends={props.reloadFriends}
                triggerReload={props.triggerReload}/>
                <FriendsAreaControls setShowModal={props.setShowModal}/>
                <FriendsList profile={props.profile}
                    currentTab={currentTab}
                    followers={[]} friends={[]}
                    reloadFriends={props.reloadFriends} 
                    triggerReload={props.triggerReload}/>
            </div>
        )
    } else {
        return (
            <div id='friends-area'>
                <FriendsAreaHeader profile={profile}
                setTab={setTab} currentTab={currentTab}
                friendData={[]} reloadFriends={props.reloadFriends}
                triggerReload={props.triggerReload}/>
                <FriendsList profile={props.profile}
                    currentTab={currentTab}
                    followers={[]} friends={[]}
                    reloadFriends={props.reloadFriends} 
                    triggerReload={props.triggerReload}/>
            </div>
        )
    }
}

module.exports = {
    FriendsArea,
}