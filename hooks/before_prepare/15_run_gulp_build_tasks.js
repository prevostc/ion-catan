#!/usr/bin/env node

console.log('Building project dist');
var gulp = require('gulp');
var path = require('path');

require(path.resolve(__dirname, '../../gulpfile.js'));

gulp.start('build');