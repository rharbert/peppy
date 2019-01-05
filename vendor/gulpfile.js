// Require Gulp
// http://stackoverflow.com/questions/32490328/gulp-autoprefixer-throwing-referenceerror-promise-is-not-defined
require('es6-promise').polyfill();
var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var prefix = require('gulp-autoprefixer');
var watch = require('gulp-watch');
var del = require('del');
var spritesmith = require('gulp.spritesmith');

// Sass
gulp.task('sass', function() {
  gulp.src('../public/style/scss/**/*.scss')
    .pipe(sourcemaps.init()) // Initialize sourcemaps
    .pipe(sass({
        errLogToConsole: true
        }))
    .pipe(prefix('last 2 versions', '>1%', 'ie 8'))
    .pipe(sourcemaps.write()) // Writes sourcemaps into the CSS file
    .pipe(gulp.dest('../public/style/css'));
})

// Watch
gulp.task('watch', function() {
  gulp.watch('../public/style/scss/**/*.scss', ['sass'])
})

// Clean
gulp.task('clean', function(cb) {
    del(['../public/style/css/**/*.css'], cb)
});

// Default
gulp.task('default', ['sass', 'watch']);

// Sprite
gulp.task('sprite', function() {
    var spriteData =
        gulp.src('images/sprite-these/*.*') // source path of the sprite images
            .pipe(spritesmith({
                imgName: 'sprite-manufacturer-logos.png',
                cssName: '_sprite-manufacturer-logos.scss',
            }));

    spriteData.img.pipe(gulp.dest('images/')); // output path for the sprite
    spriteData.css.pipe(gulp.dest('../public/style/scss/init/sprites/')); // output path for the SCSS
});

// Handle the error
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}
