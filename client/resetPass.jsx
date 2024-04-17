const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');
const {motion} = require('framer-motion');

const handleReset = (e) => {
    // Prevent default events
    e.preventDefault();
    helper.handleError()

    // Grab variables
    const username = e.target.querySelector('#user').value;
    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    // Check if any fields are empty
    if(!username || !pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    // Post the username, password, and new password
    helper.sendPost(e.target.action, {username, pass, pass2});
    return false;
}

const ResetPasswordWindow = (props) => {
    const animDelay = 0.8;

    return(
        <motion.form id="reset-form"
        name="resetForm"
        onSubmit={handleReset}
        action="/resetpass"
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
                        RESET PASSWORD
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
                        <input id="pass2" type="password" placeholder="NEW PASSWORD"/>
                    </motion.div>
                </motion.div>

                <motion.div className="submit-area"
                    animate={{opacity: [0, 1]}}
                    transition={{
                        ease: "easeInOut",
                        delay: animDelay + 0.30
                    }}
                >
                    <button className="form-submit" type="submit">RESET</button>
                </motion.div>
            </motion.div>
        </motion.form>
    )
};

const LoadPage = (props) => {
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
            <ResetPasswordWindow/>
            <div id='message-handler' class='hidden'>
                <p id='message-text'></p>
            </div>
        </motion.div>
    )
};

const init = () => {
    const root = createRoot(document.getElementById('content'));
    // homePage.addEventListener('click', (e) => {
    //     e.preventDefault();

    //     // Unload page

    //     helper.sendGet('/homeGuest', null);
    //     return false;
    // })

    // Render the login window
    root.render(<LoadPage/>)
};

window.onload = init;