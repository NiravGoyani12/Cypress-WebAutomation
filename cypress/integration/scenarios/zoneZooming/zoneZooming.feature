Feature: Zooming in on zones

  Background:
    Given we have a known good system
    And we are logged in as "factory" with password "fotechf00"
    And we wipe the database silently
    And we click the "menuToggler" status bar button

    Scenario: We can zoom in on zones

        Given we have the "Data Capture" dialog open
            | panelGroup| panelOption       | panel              |
            | Channels  | Optical Channel 1 | Channel properties |

        Then we add fibre segment calibrations
            | channel| monitorStart | monitorEnd | cableStart |
            | A      | 0            | 5000       | -5000      |
        And we enable fibre segment calibrations
        And we click on the "apply" dialog button
        Then the apply completes
        And we wait 5 seconds
        And the "reset" dialog button is "disabled"
        And the "cancel" dialog button is "enabled"
        Then we close the current panel

        Given we open the "Zones" panel
            | panelGroup|
            | Channels  |

        Then we click on the new zone button
        And we enter a zone named "negative" from -4000 to -3000
        Then we wait 5 seconds

        Then we click on the new zone button
        And we enter a zone named "positive" from 2000 to 3000

        Then we can zoom to the "negative" zone successfully
        And we can zoom to the "positive" zone successfully

