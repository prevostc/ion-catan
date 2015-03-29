require('../helpers/setup');

var wd = require("wd"),
    _ = require('underscore'),
    serverConfigs = require('../helpers/appium-servers'),
    path = require('path');

var driver;
var allPassed = true,
    platform = process.env.PLATFORM || 'ios',
    iOSDeviceUDID = process.env.IOS_UDID;

function setupWithAppiumServer(serverConfig) {
    return wd.promiseChainRemote(serverConfig);
}

function setupLogging(driver) {
    require("../helpers/logging").configure(driver);
}

function addCapabilitiesAndInit(capabilities, driver) {
    var desired = _.clone(capabilities[platform]);
    desired.app = path.join('../../', require("../helpers/apps")[platform]);

    if (platform === 'ios' && iOSDeviceUDID) {
        desired.udid = iOSDeviceUDID;
    }

    if (platform === 'android') {
        desired.appPackage = process.env.APP_PACKAGE;
        desired.appActivity = process.env.APP_ACTIVITY;
    }

    if (process.env.SAUCE) {
        desired.name = platform + ' - Can generate';
        desired.tags = ['sample'];
    }
    return driver.init(desired);
}

function switchToUIWebViewContext(driver) {
    // instead of default NATIVE_APP context

    return driver.setImplicitWaitTimeout(3000)
        .contexts()
        .then(function (contexts) {
            var webViewContext = _.find(contexts, function (context) {
                return context.indexOf('WEBVIEW') !== -1;
            });
            console.log('webViewContext', webViewContext);
            return driver.context(webViewContext);
        });
}

function beforeAll() {
    var serverConfig = process.env.SAUCE ? serverConfigs.sauce : serverConfigs.local;
    driver = setupWithAppiumServer(serverConfig);

    // uncomment to see appium logs
    //setupLogging(driver);

    driver = addCapabilitiesAndInit(require("../helpers/capabilities"), driver);

    return switchToUIWebViewContext(driver);
}

function afterAll() {
    function sleep(time) {
        var stop = new Date().getTime();
        while(new Date().getTime() < stop + time) {
            ;
        }
    }
    driver.quit();
    console.log('Waiting for appium to quit');
    sleep(7000);
}

// global setup
var envLoadedPromise = beforeAll();
process.on('beforeExit', afterAll);
//do something when app is closing
process.on('exit', afterAll);
//catches ctrl+c event
process.on('SIGINT', afterAll);
//catches uncaught exceptions
process.on('uncaughtException', afterAll);

var WorldConstructor = function WorldConstructor(callback) {

    // World constructor is called for each feature

    var world = {
        driver: driver
    };

    // tell Cucumber we're finished and to use our world object instead of 'this'
    envLoadedPromise.then(function() {
        callback(world);
    });
};
exports.World = WorldConstructor;

