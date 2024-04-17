const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');
const {motion} = require('framer-motion');

let currentPage = true; // True is login, false is signup

const handleLogin = (e) => {
    // Prevent default events
    e.preventDefault();
    helper.hideMessages();

    // Get the username and password
    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    // Check if either the username or password fields are empty
    if(!username || !pass) {
        helper.handleMessage('Username or password is empty!');
        return false;
    }

    // Post the username and password
    helper.sendPost(e.target.action, {username, pass});
    return false;
};

const handleSignup = (e) => {
    // Prevent default events
    e.preventDefault();
    helper.hideMessages();

    // Grab variables
    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    // Check if any fields are empty
    if(!username || !pass || !pass2) {
        helper.handleMessage('All fields are required!');
        return false;
    }

    // Post the username, password, and password confirmation
    helper.sendPost(e.target.action, {username, pass, pass2});
    return false;
};

const LoadPage = (props) => {
    if(props.firstRender) {
        return (
            <motion.div className="form-background"
                animate={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "0%",
                    left: "0%",
                    top: "0%"
                }}
                transition={{
                    ease: "easeInOut",
                    delay: 0.2,
                    duration: 0.4,
                }}
            >
                {props.formToLoad ? <LoginWindow firstRender={props.firstRender}/> 
                    : <SignupWindow firstRender={props.firstRender}/>}
            </motion.div>
        );
    } else {
        return(
            <motion.div className="form-background-loaded"
                animate={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "0%",
                    left: "0%",
                    top: "0%"
                }}
            >
                {props.formToLoad ? <LoginWindow firstRender={props.firstRender}/> 
                    : <SignupWindow firstRender={props.firstRender}/>}
            </motion.div>
        );
    }
}

const LoginWindow = (props) => {
    const animDelay = props.firstRender ? 0.8 : 0.0;

    return (
        <motion.form id="login-form"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="main-form"
            >
                <motion.div className="form-body">
                    <motion.img src="assets/img/logo_primary.png" classname="form-image"
                        animate={{opacity: [0, 1]}}
                        exit={{opacity: [1, 0]}}
                        transition={{
                            ease: "easeInOut",
                            delay: animDelay + 0.05
                        }}
                    >
                        
                    </motion.img>
                    <motion.div className="form-header"
                        animate={{opacity: [0, 1]}}
                        transition={{
                            ease: "easeInOut",
                            delay: animDelay + 0.10
                        }}
                    >
                        <div className="form-header-text-1">
                            THE PROSE
                        </div>
                        <div className="form-header-text-2">
                            WELCOME BACK
                        </div>
                    </motion.div>

                    <motion.div className="form-input-area">
                        <motion.div className="form-input"
                            animate={{opacity:[0, 1]}}
                            transition={{
                                ease: "easeInOut",
                                delay: animDelay + 0.15
                            }}
                        >
                            <input id="user" type="text" placeholder="USERNAME"/>
                        </motion.div>
                        <motion.div className="form-input"
                            animate={{opacity:[0, 1]}}
                            transition={{
                                ease: "easeInOut",
                                delay: animDelay + 0.20
                            }}
                        >
                            <input id="pass" type="password" placeholder="PASSWORD"/>
                        </motion.div>
                    </motion.div>

                    <motion.div className="submit-area"
                        animate={{opacity: [0, 1]}}
                        transition={{
                            ease: "easeInOut",
                            delay: animDelay + 0.25
                        }}
                    >
                        <button className="form-submit" type="submit">LOGIN</button>
                    </motion.div>

                    <div id='message-handler' class='hidden'>
                        <p id='message-text'></p>
                    </div>
                </motion.div>
            </motion.form>
    );
};

const SignupWindow = (props) => {
    const animDelay = props.firstRender ? 0.8 : 0.0;

    return (
        <motion.form id="signup-form"
        name="signupForm"
        onSubmit={handleSignup}
        action="/signup"
        method="POST"
        className="main-form"
        >
            <motion.div className="form-body">
                <motion.img src="assets/img/logo_primary.png" classname="form-image"
                    animate={{opacity: [0, 1]}}
                    transition={{
                        ease: "easeInOut",
                        delay: animDelay + 0.05
                    }}
                >
                    
                </motion.img>
                <motion.div className="form-header"
                    animate={{opacity: [0, 1]}}
                    transition={{
                        ease: "easeInOut",
                        delay: animDelay + 0.10
                    }}
                >
                    <div className="form-header-text-1">
                        THE PROSE
                    </div>
                    <div className="form-header-text-2">
                        WELCOME
                    </div>
                </motion.div>

                <motion.div className="form-input-area">
                    <motion.div className="form-input"
                        animate={{opacity:[0, 1]}}
                        transition={{
                            ease: "easeInOut",
                            delay: animDelay + 0.15
                        }}
                    >
                        <input id="user" type="text" placeholder="USERNAME"/>
                    </motion.div>

                    <motion.div className="form-input"
                        animate={{opacity:[0, 1]}}
                        transition={{
                            ease: "easeInOut",
                            delay: animDelay + 0.20
                        }}
                    >
                        <input id="pass" type="password" placeholder="PASSWORD"/>
                    </motion.div>

                    <motion.div className="form-input"
                        animate={{opacity:[0, 1]}}
                        transition={{
                            ease: "easeInOut",
                            delay: animDelay + 0.25
                        }}
                    >
                        <input id="pass2" type="password" placeholder="CONFIRM PASSWORD"/>
                    </motion.div>
                </motion.div>

                <motion.div className="submit-area"
                    animate={{opacity: [0, 1]}}
                    transition={{
                        ease: "easeInOut",
                        delay: animDelay + 0.30
                    }}
                >
                    <button className="form-submit" type="submit">SIGN UP</button>
                </motion.div>

                <div id='message-handler' class='hidden'>
                    <p id='message-text'></p>
                </div>
            </motion.div>
        </motion.form>
    );
};

const init = () => {
    // Get page details
    const navBar = document.getElementById('nav-bar');
    const signupValue = navBar.className;
    if(signupValue === 'true') currentPage = false;
    if(signupValue === 'false') currentPage = true;

    // Get the login and signup buttons
    const loginButton = document.getElementById('login-button');
    const signupButton = document.getElementById('signup-button');
    //const homePage = document.getElementById('home-page-link');

    // Set the root to the content element
    const root = createRoot(document.getElementById('content'));

    // Render the login window on click
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        currentPage = true;
        root.render(<LoadPage firstRender={false} formToLoad={currentPage}/>)
        return false;
    });

    // Render the signup window on click
    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        currentPage = false;
        root.render(<LoadPage firstRender={false} formToLoad={currentPage}/>)
        return false;
    });

    // homePage.addEventListener('click', (e) => {
    //     e.preventDefault();

    //     // Unload page

    //     helper.sendGet('/homeGuest', null);
    //     return false;
    // })

    // Render the login window
    root.render(<LoadPage firstRender={true} formToLoad={currentPage}/>)
};

window.onload = init;