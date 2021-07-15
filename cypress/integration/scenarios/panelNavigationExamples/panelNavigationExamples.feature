Feature: Examples of opening/closing panels and dialogs

    Background:
        Given we have a known good system
        And we are logged in as "factory" with password "fotechf00"
        And we click the "menuToggler" status bar button

    Scenario: We can open panels and dialogs with various nestings

        Given we have the "Identity" dialog open
            | panelGroup | panel             |
            | Settings   | System properties |

        When we open the "Optics" dialog in the current panel
        Then the "Optics" dialog in the current panel "should" be open
        And the "Identity" dialog in the current panel "should" be open
        And the "Watchdog" dialog in the current panel "should not" be open
        When we close the "Optics" dialog in the current panel
        Then the "Optics" dialog in the current panel "should not" be open
        Then we close the current panel

        Given we have the "Data Capture" dialog open
            | panelGroup | panelOption       | panel              |
            | Channels   | Optical Channel 1 | Channel properties |
        Then we close the current panel

        Given we open the "System properties" panel
            | panelGroup |
            | Settings   |
        And we open the "Optics" dialog in the current panel
        Then the "Optics" dialog in the current panel "should" be open
        And we close the "Optics" dialog in the current panel
        Then the "Optics" dialog in the current panel "should not" be open
        Then we close the current panel

        Given we open the "System health visuals" panel
            | panelGroup    |
            | System Health |
        Then the "systemhealth_visuals" component "is" visible
        Given we open the "System health details" panel
            | panelGroup    |
            | System Health |
        Then the "systemhealth_details" component "is" visible
