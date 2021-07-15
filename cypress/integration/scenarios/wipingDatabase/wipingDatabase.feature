Feature: Wiping database
  we want wipe the database via the UI 

Scenario: Wiping the database resets defaults
    Given we have a known good system
    And we are logged in as "factory" with password "fotechf00"
    And we click the "menuToggler" status bar button
    And we wipe the database
    Then then database value for the "length" property of "channel/1" is "40000"
