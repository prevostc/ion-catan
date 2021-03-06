// features/step_definitions/myStepDefinitions.js

var myStepDefinitionsWrapper = function () {
    this.World = require("../support/world.js").World; // overwrite default World constructor

    this.Then(/^I should see "([^"]*)" as the page title$/, function (arg1, callback) {
        this.driver
            .waitForElementByCss('div[nav-bar=active] .title.title-center', 5000)
            .text().should.eventually.include(arg1)
            .notify(callback)
        ;
    });

    this.Then(/^I should not see "([^"]*)" as the page title$/, function (arg1, callback) {
        this.driver
            .waitForElementByCss('div[nav-bar=active] .title.title-center', 5000)
            .text().should.eventually.not.include(arg1)
            .notify(callback)
        ;
    });

    this.Then(/^I click on the "([^"]*)" tab$/, function (arg1, callback) {
        this.driver
            .waitForElementByCss('ion-tabs ' + arg1, 5000)
            .click()
            .should.notify(callback)
        ;
    });
};

module.exports = myStepDefinitionsWrapper;