/*jslint node: true */

'use strict';

exports.configure = function (driver) {
  // See whats going on
  driver.on('status', function (info) {
    console.log(info.cyan);
  });

  driver.on('command', function (meth, path, data) {
    console.log('[command] > ' + meth.yellow, path.grey, data || '');
  });

  driver.on('http', function (meth, path, data) {
    console.log('[http] > ' + meth.magenta, path, (data || '').grey);
  });
};