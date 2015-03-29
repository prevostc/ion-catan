Feature: Tabs
  Tab are present

  Scenario: Settings
    Given I load the app
    Then I click on the ".ion-ios-gear" tab
    Then I should see "Settings" as the page title

  Scenario: Favorites
    Given I load the app
    Then I click on the ".ion-star" tab
    Then I should see "Favorites" as the page title

