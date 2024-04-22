const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const webpack = require('webpack-stream');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint-new');
const webpackConfig = require('./webpack.config.js');

const compileSass = (done) => {
    gulp.src('./scss/*.scss') // Start the stream
        .pipe(sass().on('error', sass.logError)) // Convert the file to .css
        .pipe(gulp.dest('./hosted/styles')); // Compile into the 'hosted/style's folder

    // Execute the callback function
    done();
}

const compileJS = (done) => {
    webpack(webpackConfig) // Start webpack
        .pipe(gulp.dest('./hosted/src')); // Compile into the 'hosted/src' folder

    // Execute the callback function
    done();
}

const compileLint = (done) => {
    gulp.src('./server/**/*.js') // Check every .js file under the 'server' folder
        .pipe(eslint({fix: true})) // Run eslint
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());

    // Execute the callback function
    done();
}

const build = gulp.parallel(compileSass, compileJS, compileLint);
const herokuBuild = gulp.parallel(compileSass, compileJS);

const watch = (done) => {
    // Compile Sass whenever there are changes in the 'scss' folder
    gulp.watch('./scss', compileSass);

    // Compile JS whenever there are changes in js or jsx files
    gulp.watch(['./client/*.js', './client/*.jsx', './client/components/*.js'], compileJS);

    // Run nodemon
    nodemon({
        script: './server/app.js', // Which file should be run on restart
        tasks: ['lintTask'], // Defines which tasks to run before restarting
        watch: ['./server'], // Tells nodemon which folder to watch for changes in
        done: done // Tell gulp when it has stopped watching the code
    });
}

module.exports = {
    compileSass,
    compileJS,
    compileLint,
    build,
    herokuBuild,
    watch,
}