const path = require('path');

module.exports = {
    entry: {
        login: './client/login.jsx',
        homeGuest: './client/homeGuest.jsx',
        home: './client/home.jsx',
        profile: './client/profile.jsx',
        resetPass: './client/resetPass.jsx',
    },
    module : {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
    mode: 'production',
    watchOptions: {
        aggregateTimeout: 200,
    },
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: '[name]Bundle.js',
    },
};