require('path');
var webdriver = require("selenium-webdriver");

var driver = new webdriver.Builder().
    withCapabilities({
        browserName: '',
        seleniumAddress: 'http://localhost:4444/wd/hub',
        platform: 'ANDROID',
        platformName: 'Android',
        platformVersion: "4.4",
        automationName: "Selendroid",
        appActivity: "CordovaApp",
        appPackage: "com.prevostc.settlerseasymap",
        deviceName: "YT910WWJBK",
        app: __dirname + '/../../platforms/android/ant-build/CordovaApp-debug.apk'
    }).
    usingServer('http://localhost:4444/wd/hub').
    build();

var World = function World(callback) {
    this.driver = driver;

    callback();
};

exports.World = World;


