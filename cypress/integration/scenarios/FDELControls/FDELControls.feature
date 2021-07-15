Feature: Helios Control

  we want to test the Helios Control switches

Scenario: Switching Helios on and off
    Given we have a known good system
    And we are logged in as "factory" with password "fotechf00"
    Given we click the "FDELControl" status bar button
    Then the "FDELControl" fly-out appears
    And the "Helios" status says "Not Running"

    Given we click the "Helios" service toggle
    And we wait 5 seconds
    Then the "Helios" status says one of "Waiting for Data" or "Running"
    And the "Laser" status says "Laser On"

    Given we click the "Helios" service toggle
    Then the "Helios" status says "Not Running"
    And the "Laser" status says "Laser On"
    Then we click the "Laser" service toggle
    Then the "Laser" status says "Laser Off"

    Given we click the "FDELControl" status bar button
    Then the "FDELControl" fly-out disappears

Scenario: Switching on Laser on and off
    Given we click the "FDELControl" status bar button
    Then the "FDELControl" fly-out appears
    And the "Laser" status says "Laser Off"

    Given we click the "Laser" service toggle
    Then the "Laser" status says "Laser On"

    Given we click the "Laser" service toggle
    Then the "Laser" status says "Laser Off"

    Given we click the "FDELControl" status bar button
    Then the "FDELControl" fly-out disappears

Scenario: Switch to playback mode
    Given we click the "FDELControl" status bar button
    Then the "FDELControl" fly-out appears

    Given we click on the "playbackcontrol" button
    Then a modal popup entitled "Switch to playback mode" appears

    Given we click the "ok" button on the modal popup
    Then we should be redirected to the simulator
    And we wait for the UI to load
    Then the "panel_dock_Playback" component "is" visible

Scenario: Switch to live mode
    Given we click the "FDELControl" status bar button
    Then the "FDELControl" fly-out appears

    Given we click on the "playbackcontrol" button
    Then a modal popup entitled "Switch to live mode" appears

    Given we click the "ok" button on the modal popup
    Then we should be redirected to live
    And we wait for the UI to load
    Then the "panel_dock_Playback" component "is not" visible
