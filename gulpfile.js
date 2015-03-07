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
var templateCache = require('gulp-angular-templatecache');

var paths = {
    sass: ['./scss/**/*.scss'],
    jsProject: [
        "./www/js/catan/js/catan.js",
        "./www/js/catan/js/hexagon.js",
        "./www/js/catan/js/map.js",
        "./www/js/catan/js/tools.js",
        "./www/js/catan/js/ui.js",
        "./www/js/catan/js/position.js",
        "./www/js/catan/js/generator/generator.js",
        "./www/js/catan/js/generator/generator.land.js",
        "./www/js/catan/js/generator/generator.number.js",
        "./www/js/catan/js/generator/generator.harbor.js",
        './www/js/**/*.js'],
    jsProjectTarget: 'project.js',
    jsVendorTarget: 'vendor.js',
    cssProject: ['./www/css/style.css'],
    cssProjectTarget: 'project.css',
    cssVendorTarget: 'vendor.css',
    dist: 'www/dist'
};

gulp.task('default', ['sass']);

gulp.task('sass', function (done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .pipe(gulp.dest('./www/css/from_scss'))
        .on('end', done);
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.jsProject, ['js-concat-project']);
    gulp.watch(paths.cssProject, ['css-concat-project']);
    gulp.watch('www/templates/**/*.html', ['html-concat-templates']);
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


gulp.task('build', function() {
    gulp.start('sass');
    gulp.start('js-concat-project');
    gulp.start('js-concat-vendor');
    gulp.start('css-concat-project');
    gulp.start('css-concat-vendor');
    gulp.start('fonts-concat-vendor');
    gulp.start('html-concat-templates');
});


gulp.task('js-concat-project', function () {
    return gulp.src(paths.jsProject)
        .pipe(concat(paths.jsProjectTarget))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('js-concat-vendor', function () {
    return gulp.src(mainBowerFiles())
        .pipe(gulpFilter('**/*.js'))
        .pipe(concat(paths.jsVendorTarget))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('css-concat-project', function () {
    return gulp.src(paths.cssProject)
        .pipe(concat(paths.cssProjectTarget))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('css-concat-vendor', function () {
    return gulp.src(mainBowerFiles())
        .pipe(gulpFilter('**/*.css'))
        .pipe(concat(paths.cssVendorTarget))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('fonts-concat-vendor', function () {
    return gulp.src(mainBowerFiles())
        .pipe(gulpFilter(function (file) {
            return /ionic\/fonts/.test(file.path);
        }))
        .pipe(debug())
        .pipe(gulp.dest('./www/fonts/'));
});

gulp.task('html-concat-templates', function() {
    gulp.src('www/templates/**/*.html')
        .pipe(templateCache({
            module:'templatescache', standalone: true, root: './templates/'
        }))
        .pipe(gulp.dest('www/dist/'));
});