Feature: Test that monitor start and end can be set and have desired effect

  Background:
    Given we have a known good clean system logged in as "factory" with password "fotechf00"

    Scenario Outline: We can set the monitor start and end to <startValue> and <endValue>
        Given we have the "Data Capture" dialog open
            | panelGroup| panelOption       | panel              |
            | Channels  | Optical Channel 1 | Channel properties |

        When we cache the "<startField>" to "<startValue>" and "<endField>" to "<endValue>"
        And we set the "<startField>" to "<startValue>" and "<endField>" to "<endValue>"
        Then an error message "should not" be present for "<startField>" "or" "<endField>"
        And we click on the "apply" dialog button
        Then the apply completes
        And we wait 5 seconds
        Then these properties should be saved in the database
        And the soundfield ruler should have the limits "<startValue>" and "<endValue>"

        Examples:
        | startField                   | startValue    | endField                  | endValue  |
        | Monitor Start Distance       | 0             | Monitor End Distance      | 39999     |
        | Monitor Start Distance       | 100           | Monitor End Distance      | 38000     |

    Scenario Outline: Invalid monitor start and end values of <startValue> and <endValue> produces an error
         Given we have the "Data Capture" dialog open
            | panelGroup| panelOption       | panel              |
            | Channels  | Optical Channel 1 | Channel properties | 

        When we cache the "<startField>" to "<startValue>" and "<endField>" to "<endValue>"
        And we set the "<startField>" to "<startValue>" and "<endField>" to "<endValue>"
        And we click on the "apply" dialog button
        Then the apply completes
        Then an error message "should" be present for "<startField>" "or" "<endField>"

        Examples:
        | startField               | startValue    | endField                  | endValue  |
        | Monitor Start Distance   | start         | Monitor End Distance      | end       |
        | Monitor Start Distance   | -10           | Monitor End Distance      | 40000     |
        | Monitor Start Distance   | 0             | Monitor End Distance      | 40010     |
        | Monitor Start Distance   | 200           | Monitor End Distance      | 50        |
        | Monitor Start Distance   | 5             | Monitor End Distance      | 9         |
