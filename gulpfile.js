var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var sourcemaps = require('gulp-sourcemaps');
var debug = require('gulp-debug');
var mainBowerFiles = require('main-bower-files');
var gulpFilter = require('gulp-filter');

var paths = {
    sass: ['./scss/**/*.scss'],
    jsProject: ['./www/js/**/*.js'],
    jsProjectTarget: 'project.js',
    jsVendorTarget: 'vendor.js',
    cssProject: ['./www/css/**/*.css'],
    cssProjectTarget: 'project.css',
    cssVendorTarget: 'vendor.css',
    dist: 'www/dist'
};

gulp.task('default', ['sass']);

gulp.task('sass', function (done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./www/css/from_scss'))
        .on('end', done);
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.jsProject, ['js-concat-project']);
    gulp.watch(paths.cssProject, ['css-concat-project']);
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});


gulp.task('js-concat-project', function () {
    return gulp.src(paths.jsProject)
        .pipe(sourcemaps.init())
        .pipe(concat(paths.jsProjectTarget))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('js-concat-vendor', function () {
    return gulp.src(mainBowerFiles())
        .pipe(gulpFilter('**/*.js'))
        .pipe(sourcemaps.init())
        .pipe(concat(paths.jsVendorTarget))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('css-concat-project', function () {
    return gulp.src(paths.cssProject)
        .pipe(sourcemaps.init())
        .pipe(concat(paths.cssProjectTarget))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('css-concat-vendor', function () {
    return gulp.src(mainBowerFiles())
        .pipe(gulpFilter('**/*.css'))
        .pipe(sourcemaps.init())
        .pipe(concat(paths.cssVendorTarget))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('fonts-concat-vendor', function () {
    return gulp.src(mainBowerFiles())
        .pipe(gulpFilter(function (file) {
            return /ionicons\/fonts/.test(file.path);
        }))
        .pipe(gulp.dest('./www/fonts/'));
});
