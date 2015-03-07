#!/usr/bin/env node

/**
 * After prepare, files are copied to the platforms/ios and platforms/android folders.
 * Lets clean up some of those files that arent needed with this hook.
 */
var fs = require('fs');
var path = require('path');

var deleteFolderRecursive = function(removePath) {
  if( fs.existsSync(removePath) ) {
    fs.readdirSync(removePath).forEach(function(file,index){
      var curPath = path.join(removePath, file);
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(removePath);
  }
};

var wwwPrefixes = [
    //'../../platforms/ios/www',
    '../../platforms/android/assets/www'
];

for (var i = 0 ; i < wwwPrefixes.length ; i++) {
    deleteFolderRecursive(path.resolve(__dirname, wwwPrefixes[i] + '/lib'));
    deleteFolderRecursive(path.resolve(__dirname, wwwPrefixes[i] + '/js'));
    deleteFolderRecursive(path.resolve(__dirname, wwwPrefixes[i] + '/css'));
}