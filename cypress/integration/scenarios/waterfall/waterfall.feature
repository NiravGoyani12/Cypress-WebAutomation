Feature: The waterfall should progress when FDEL is processing

    Background: we are not logged in
        Given we have a known good system and are not logged in

	@stress
        Scenario Outline: When we as <user> start FDEL processing in <mode> mode - the waterfall should progress down the screen
            Given we are logged in as "<user>" with password "<password>"
            And we ensure "Helios" "is" running
            When FDEL is processing in "<mode>" mode
            Then the waterfall "should" progress

            Examples:
            | user    | password  | mode                  |
            | admin   | admin     | Default               |
            | admin   | admin     | Raw Fibre Shot        |
            | admin   | admin     | Mean Fibre Shot       |
            | admin   | admin     | Mean Fibre Shot Drift |
            | factory | fotechf00 | Default               |
            | factory | fotechf00 | Raw Fibre Shot        |
            | factory | fotechf00 | Mean Fibre Shot       |
            | factory | fotechf00 | Mean Fibre Shot Drift |
  
        Scenario Outline: When we as <user> start FDEL processing and press Pause - the waterfall should stop
            Given we are logged in as "<user>" with password "<password>"
            And we ensure "Helios" "is" running
            When FDEL is processing in "Raw Fibre Shot" mode
            Then the waterfall "should" progress
            When we click the "Pause" button in FDEL toolbar
            Then the waterfall "should not" progress

            Examples:
            | user    | password  |
            | admin   | admin     |
            | factory | fotechf00 |

        Scenario: When we play back a file the waterfall should progress down the screen
            Given we redirect to "/?mode=playback" authenticated as "admin" with password "admin"
            And we click on the file chooser button
            Then the "Simulator" panel "should" be open
            Given we select the first available "fds" file in "/opt/Fotech/data/HeliosData/cypress" containing "cypress"
            Then the playback file should be the selected file
            And the "play" playback buttons "should" be enabled
            When we click on the "play" playback button
            And the "stop" playback buttons "should" be enabled
            Then the waterfall "should" progress

        Scenario: When in playback, pressing the stop button stops the playback
            Given we redirect to "/?mode=playback" authenticated as "admin" with password "admin"
            And we click on the file chooser button
            Then the "Simulator" panel "should" be open
            Given we select the first available "fds" file in "/opt/Fotech/data/HeliosData/cypress" containing "cypress"
            Then the playback file should be the selected file
            And the "play" playback buttons "should" be enabled
            When we click on the "play" playback button
            And the "stop" playback buttons "should" be enabled
            Then the waterfall "should" progress
            When we click on the "stop" playback button
            Then the waterfall "should not" progress

        Scenario: When we am in playback mode, pressing pause stops the waterfall
            Given we redirect to "/?mode=playback" authenticated as "admin" with password "admin"
            And we click on the file chooser button
            Then the "Simulator" panel "should" be open
            Given we select the first available "fds" file in "/opt/Fotech/data/HeliosData/cypress" containing "cypress"
            Then the playback file should be the selected file
            And the "play" playback buttons "should" be enabled
            When we click on the "play" playback button
            And the "stop" playback buttons "should" be enabled
            Then the waterfall "should" progress
            When we click on the "pause" playback button
            Then the waterfall "should not" progress
            When we click on the "play" playback button
            Then the waterfall "should" progress
            
        Scenario: When we are in vertical orientation the waterfall should progress when we start FDEL
            Given we are logged in as "admin" with password "admin"
            And we click the "menuToggler" status bar button
            And we set the following preferences
                | name          | value    | type      |
                | Orientation   | vertical | select    | 
            And we ensure "Helios" "is" running
            When FDEL is processing in "Raw Fibre Shot" mode
            Then the waterfall "should" progress

       Scenario Outline: When we set the waterfall orientation to <orientation>, the waterfall should match the orientation selected
            Given we are logged in as "admin" with password "admin"
            And we click the "menuToggler" status bar button
            When we set the following preferences
                | name          | value         | type      |
                | Orientation   | <orientation> | select    | 
            Then the waterfall scale should be located according to the "<orientation>"
            
            Examples:
            | orientation |
            | Vertical    |
            | Horizontal  |
