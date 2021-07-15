Feature: Segment calibration and suppression zone error handling

  Background:
    Given we have a known good clean system logged in as "factory" with password "fotechf00"

    Scenario Outline: We have appropriate error messaging for bad fibre segment calibration

        Given we have the "Data Capture" dialog open
            | panelGroup| panelOption       | panel              |
            | Channels  | Optical Channel 1 | Channel properties |

        When we click the button to add a new fibre segment calibration
        And we set the "<startField>" to "<startValue>" and "<endField>" to "<endValue>"
        Then an error message "should not" be present for "<startField>" "and" "<endField>"
        And an error message "should" be present for the individual fibre segment definition
        
        And the notes section for "<startField>" "should not" be visible
            | propertyType      | 
            | Repeated.Group    |
            | Group             | 
    
        And an error message "should not" be visible for the overall "Fibre Segment Calibration" section
        Then we reset the dialog

        Examples:
        | startField                   | startValue    | endField             | endValue  |
        | Monitor Start Position       | junk          | Monitor End Position | junk      |

    Scenario Outline: We have appropriate error messaging for bad suppression zones
        Given we have a dialog open
            | panelGroup| panelOption       | panel              | dialog       |
            | Channels  | Optical Channel 1 | Channel properties | Suppression  |

        When we add a new suppression zone for the "<stream>" stream with lower value of "<lowerValue>" and upper value of "<upperValue>"
        Then the notes section for the "<stream>" stream first value "should not" be visible
        And an error message "should" be visible for the overall "Suppression Zones" section
        And we remove the new suppression zone for the "<stream>" stream

        Examples:
        | stream   | lowerValue    | upperValue  |
        | All      | junk          | junk        |
        | All      | [blank]       | [blank]     |
