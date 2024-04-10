const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

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
        <form id="loginForm"
            name="loginForm"
            onSubmit={handleLogin}
            action="/login"
            method="POST"
            className="mainForm"
        >
                <label htmlFor="username">Username: </label>
                <input id="user" type="text" name="username" placeholder="username"/>
                <label htmlFor="pass">Password: </label>
                <input id="pass" type="password" name="pass" placeholder="password"/>
                <input className="formSubmit" type="submit" value="Sign in"/>
        </form>
    );
};

const SignupWindow = (props) => {
    return (
        <form id="signupForm"
            name="signupForm"
            onSubmit={handleSignup}
            action="/signup"
            method="POST"
            className="mainForm"
        >
                <label htmlFor="username">Username: </label>
                <input id="user" type="text" name="username" placeholder="username"/>
                <label htmlFor="pass">Password: </label>
                <input id="pass" type="password" name="pass" placeholder="password"/>
                <label htmlFor="pass">Password: </label>
                <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
                <input className="formSubmit" type="submit" value="Sign in"/>
        </form>
    );
};

const init = () => {
    // Get the login and signup buttons
    const loginButton = document.getElementById('loginButton');
    const signupButton = document.getElementById('signupButton');

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