// features/step_definitions/myStepDefinitions.js
var conf = require('../helpers/config.js');

var myStepDefinitionsWrapper = function () {
    this.World = require("../support/world.js").World; // overwrite default World constructor

    this.Given(/^I load the app$/, function (callback) {
        // nothing to do here
        callback();
    });

    this.Then(/^I should see "([^"]*)" in "([^"]*)"$/, function (arg1, arg2, callback) {
        this.driver
            .waitForElementByCss(arg2, conf.WAIT_ELEMENT_TIMEOUT)
            .should.eventually.exist
            .waitForElementByCss(arg2, conf.WAIT_ELEMENT_TIMEOUT)
            .text().should.eventually.include(arg1)
            .notify(callback)
        ;
    });

    this.Given(/^I click on "([^"]*)"$/, function (arg1, callback) {
        this.driver
            .waitForElementByCss(arg1, conf.WAIT_ELEMENT_TIMEOUT)
            .should.eventually.exist
            .waitForElementByCss(arg1, conf.WAIT_ELEMENT_TIMEOUT)
            .click()
            .should.notify(callback)
        ;
    });
};

module.exports = myStepDefinitionsWrapper;