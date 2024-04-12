const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');
const {motion} = require('framer-motion');

const handleLogin = (e) => {
    // Prevent default events
    e.preventDefault();

    // Get the username and password
    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;

    // Check if either the username or password fields are empty
    if(!username || !pass) {
        helper.handleError('Username or password is empty!');
        return false;
    }

    // Post the username and password
    helper.sendPost(e.target.action, {username, pass});
    return false;
};

const handleSignup = (e) => {
    // Prevent default events
    e.preventDefault();

    // Grab variables
    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    // Check if any fields are empty
    if(!username || !pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    // Post the username, password, and password confirmation
    helper.sendPost(e.target.action, {username, pass, pass2});
    return false;
};

const LoginWindow = (props) => {
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
                        transition={{
                            ease: "easeInOut",
                            delay: 0.85
                        }}
                    >
                        
                    </motion.img>
                    <motion.div className="form-header"
                        animate={{opacity: [0, 1]}}
                        transition={{
                            ease: "easeInOut",
                            delay: 0.9
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
                                delay: 0.95
                            }}
                        >
                            <input id="user" type="text" placeholder="USERNAME"/>
                        </motion.div>
                        <motion.div className="form-input"
                            animate={{opacity:[0, 1]}}
                            transition={{
                                ease: "easeInOut",
                                delay: 1.0
                            }}
                        >
                            <input id="pass" type="password" placeholder="PASSWORD"/>
                        </motion.div>
                    </motion.div>

                    <motion.div className="submit-area"
                        animate={{opacity: [0, 1]}}
                        transition={{
                            ease: "easeInOut",
                            delay: 1.05
                        }}
                    >
                        <button className="form-submit" type="submit">LOGIN</button>
                    </motion.div>
                </motion.div>
            </motion.form>
        </motion.div>
    );
};

const SignupWindow = (props) => {
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
                            delay: 0.85
                        }}
                    >
                        
                    </motion.img>
                    <motion.div className="form-header"
                        animate={{opacity: [0, 1]}}
                        transition={{
                            ease: "easeInOut",
                            delay: 0.9
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
                                delay: 0.95
                            }}
                        >
                            <input id="user" type="text" placeholder="USERNAME"/>
                        </motion.div>

                        <motion.div className="form-input"
                            animate={{opacity:[0, 1]}}
                            transition={{
                                ease: "easeInOut",
                                delay: 1.0
                            }}
                        >
                            <input id="pass" type="password" placeholder="PASSWORD"/>
                        </motion.div>

                        <motion.div className="form-input"
                            animate={{opacity:[0, 1]}}
                            transition={{
                                ease: "easeInOut",
                                delay: 1.05
                            }}
                        >
                            <input id="pass2" type="password" placeholder="CONFIRM PASSWORD"/>
                        </motion.div>
                    </motion.div>

                    <motion.div className="submit-area"
                        animate={{opacity: [0, 1]}}
                        transition={{
                            ease: "easeInOut",
                            delay: 1.10
                        }}
                    >
                        <button className="form-submit" type="submit">SIGN UP</button>
                    </motion.div>
                </motion.div>
            </motion.form>
        </motion.div>
    );
};

const init = () => {
    // Get the login and signup buttons
    const loginButton = document.getElementById('login-button');
    const signupButton = document.getElementById('signup-button');

    // Set the root to the content element
    const root = createRoot(document.getElementById('content'));

    // Render the login window on click
    loginButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<LoginWindow/>);
        return false;
    });

    // Render the signup window on click
    signupButton.addEventListener('click', (e) => {
        e.preventDefault();
        root.render(<SignupWindow/>);
        return false;
    });

    // Render the login window
    root.render(<LoginWindow/>)
};

window.onload = init;