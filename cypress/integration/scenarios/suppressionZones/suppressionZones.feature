Feature: Suppression zones

    Background:
        Given we have a known good clean system logged in as "admin" with password "admin" with database "cypress_farm"
    
    Scenario Outline: We change the value in the suppression zones then the values to be correct on refresh
        Given we have a dialog open
            | panelGroup | panelOption       | panel              | dialog      |
            | Channels   | Optical Channel 1 | Channel properties | Suppression |
        And we add a new suppression zone for the "<stream>" stream with lower value of "<lowerValue>" and upper value of "<upperValue>"
        And we click on the "apply" dialog button
        And the apply completes
        When we refresh the page
        And the "menuToggler" component "is" visible
        And we click the "menuToggler" status bar button
        And we have a dialog open
            | panelGroup | panelOption       | panel              | dialog      |
            | Channels   | Optical Channel 1 | Channel properties | Suppression |
        Then the "<stream>" stream should have the lower value of "<lowerValue>" and upper value of "<upperValue>"
        
        Examples:
            | stream   | lowerValue | upperValue |
            | Vehicle  | 250.0      | 440.0      |
            | Fence    | 250.05     | 440.05     |
            | Walk     | 250.005    | 440.005    |
            | Junc Box | 250.0005   | 440.0005   |
            | Digging  | 250.00005  | 440.00005  |
            | Mech Dig | 250.000005 | 440.000005 |

    Scenario: We should be able to create a suppression zone visually
        And we have a dialog open
                | panelGroup| panelOption       | panel              | dialog       |
                | Channels  | Optical Channel 1 | Channel properties | Suppression  |
        And we cache the amount of existing suppression ranges in the "All" stream
        When we click the Select Visually button
        And select a range in the Waterfall canvas
        Then a new range with non-empty values should appear in the active stream
