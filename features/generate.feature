Feature: Generate button
  Test if the generate button is present and is working as expected

  Scenario: App is loaded
    Given I load the app
    Then I should see "Map Generator" as the page title
    Then I should see "Generate" in "button.ion-shuffle"

  Scenario: Generate button present
    Given I load the app
    Then I should see "Map Generator" as the page title
    Then I click on "button.ion-shuffle"
    Then I should not see "Map Generator" as the page title

