var appSteps = function () {
    this.World = require("../support/world.js").World;

    this.Given(/^I load the app$/, function (callback) {
        var driver = this.driver;

        driver.getAllWindowHandles().then(function (handles) {
            driver.switchTo().window(handles[0]).then(function () {
                callback();
            });
        });
    });

    this.Then(/^I should see "([^"]*)"$/, function (text, callback) {
        var self = this;
        this.driver.getPageSource().then(function (source) {
            console.log(source, self);
            if (source.match(new RegExp(text))) {
                callback();
            } else {
                callback.fail();
            }
        });
    });
};

module.exports = appSteps;