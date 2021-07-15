Feature: Logging on

  I want to log in to Helios

Background:
    Given we have a known good system and are not logged in

  Scenario: Logging on as Factory
    Given the "FDELControl" component "is not" visible
    Then we click the "User" status bar button
    And the "User" component "is" visible
    And we enter "factory" in the "loginusername" field
    And we enter "fotechf00" in the "loginpassword" field
    Then we click on the "login" button
    And we wait for the UI to load
    Then the "User" component "is" visible
    And the username is "factory"
    And the "FDELControl" component "is" visible
