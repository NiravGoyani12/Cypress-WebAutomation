Feature: Test that panel errors are displayed correctly

Background:
    Given we have a known good system
    And we are logged in as "factory" with password "fotechf00"
    And we click the "menuToggler" status bar button

Scenario: The error summary at the top of the dialog is displayed in a human readable form
    Given we have the "Optics" dialog open
        | panelGroup| panelOption       | panel              |
        | Channels  | Optical Channel 1 | Channel properties |

    When we put "junk" in the "Pulse width" field
    Then the error summary "should" contain "Pulse width"   
    And the error summary "should not" contain "acquisition.laserPulseWidthSec"