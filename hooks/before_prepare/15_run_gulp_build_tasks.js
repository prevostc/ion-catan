var gulp = require('gulp');
var path = require('path');

require(path.resolve(__dirname, '../../gulpfile.js'));

console.log('Building project');
gulp.start('build');