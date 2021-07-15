Feature: Change detection

  we want to test the dialog change tracker

Scenario: Changing a field makes things go amber and resetting reverses the change
    Given we have a known good system
    And we are logged in as "factory" with password "fotechf00"
    Given we click the "menuToggler" status bar button
    Given we open the "Channels" panel group
    Given we open the "Optical Channel 1" sub menu
    Given we click on the "Channel properties" panel menu option in the "Optical Channel 1" sub menu
    And we cache the current value of field "name"
    Given we enter "Cypress Test" in the "name" dialog field
    Then the "name" field should turn "#ff8000"

    Given the "reset" dialog button is "enabled"
    When we click on the "reset" dialog button
    Then a modal popup entitled "Abandon changes" appears
    
    Given we click the "ok" button on the modal popup
    Then the "name" field should turn "#000000"
    And the "name" field contains the cached value
