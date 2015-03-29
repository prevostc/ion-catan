/*jslint node: true */

"use strict";

require("../helpers/setup");

var wd = require("wd"),
    _ = require('underscore'),
    serverConfigs = require('../helpers/appium-servers'),
    path = require('path');

describe("Can Login", function () {
  this.timeout(300000);

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

  before(function () {
    var serverConfig = process.env.SAUCE ? serverConfigs.sauce : serverConfigs.local;
    driver = setupWithAppiumServer(serverConfig);

    setupLogging(driver);

    driver = addCapabilitiesAndInit(require("../helpers/capabilities"), driver);

    return switchToUIWebViewContext(driver);
  });

  after(function () {
    return driver.quit().finally(function () {
        if (process.env.SAUCE) {
          return driver.sauceJobStatus(allPassed);
        }
      });
  });

  afterEach(function () {
    allPassed = allPassed && this.currentTest.state === 'passed';
  });

  it("should have generate button", function () {
    return driver
      .elementByCss('button.ion-shuffle')
      .should.eventually.exist;
  });

  it("should be clickable", function () {
    return driver
        .elementByCss('div[nav-bar=active] .title.title-center')
        .text().should.eventually.include('Map Generator')
        .elementByCss('button.ion-shuffle').click()
        .waitForElementByCss('div[nav-bar=active] .title.title-center', 5000)
        .text().should.eventually.not.include('Map Generator')
       ;
  });

});