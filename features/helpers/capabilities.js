/*jslint node: true */

'use strict';

exports.ios = {
  browserName: '',
  'appium-version': '1.3',
  platformName: 'iOS',
  platformVersion: '8.2',
  deviceName: 'iPhone 4s',
  app: undefined // will be set later
};

exports.android = {
/*  browserName: '',
  'appium-version': '1.3',
  platformName: 'Android',
  platformVersion: '5.0',
  automationName: 'selendroid',
  deviceName: 'Android',
  app: undefined, // will be set later
  appActivity: '.CordovaApp',
  appWaitActivity: '.CordovaApp',
  appPackage: 'com.prevostc.settlerseasymap'
*/
    browserName: '',
    'appium-version': '1.3',
    platformName: 'Android',
    platformVersion: '4.4',
    deviceName: 'Android Emulator',
    automationName: 'Selendroid',
    deviceType: "phone",
    androidUseRunningApp: false,
    appPackage: 'com.prevostc.settlerseasymap',
    appActivity: '.CordovaApp',
    app: undefined // will be set later
};