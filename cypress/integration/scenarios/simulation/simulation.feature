Feature: Simulation (playback controller)

  we want to test the playback controller
  Background:
    Given we have a known good system
        
        Scenario: Switching to playback mode
            Given we are logged in as "admin" with password "admin"
            And we click the "FDELControl" status bar button
            Then the "FDELControl" fly-out appears

            Given we click on the "playbackcontrol" button
            Then a modal popup entitled "Switch to playback mode" appears

            Given we click the "ok" button on the modal popup
            Then we should be redirected to the simulator

            Given we redirect to "/?mode=playback" authenticated as "admin" with password "admin"
            Then the "panel_dock_Playback" component "is" visible
            And all playback controller buttons should be disabled
            And the playback file should be "No file selected"
            And the "graphlogging" playback buttons "should not" be visible
            And the "rewind, play, pause, loop, fastforward, speed" playback buttons "should" be visible

        Scenario: Playing back a file
            Given we redirect to "/?mode=playback" authenticated as "admin" with password "admin"
            And we click on the file chooser button
            Then the "Simulator" panel "should" be open

            Given we select the first available "fds" file in "/opt/Fotech/data/HeliosData/cypress" containing "cypress"
            Then the playback file should be the selected file
            And the "rewind, play, pause, loop, fastforward, speed" playback buttons "should" be enabled
            And the "stop" playback buttons "should not" be enabled
            And the progress bar should be at 0%

            Given we click on the "play" playback button
            And we wait 2 seconds
            Then the "play" playback buttons "should not" be enabled
            And the "stop, pause" playback buttons "should" be enabled
            Then we wait 2 seconds
            And the progress bar "should" have advanced
            Then we wait 2 seconds
            And the progress bar "should" have advanced

            Given we click on the "pause" playback button
            Then the "pause" playback buttons "should not" be enabled
            And the "stop, play" playback buttons "should" be enabled
            Then we wait 2 seconds
            And the progress bar "should not" have advanced

            Given we click on the "play" playback button
            Then the "stop, pause" playback buttons "should" be enabled
            And the "play" playback buttons "should not" be enabled
            Then we wait 2 seconds
            And the progress bar "should" have advanced

            Given we click on the "stop" playback button
            Then we wait 2 seconds
            And the "stop" playback buttons "should not" be enabled
            And the "play" playback buttons "should" be enabled
            And the progress bar should be at 0%

            Given we click on the "play" playback button
            Then we wait 20 seconds
            And the "stop" playback buttons "should" be enabled
            And the "play" playback buttons "should not" be enabled
            Then we wait 20 seconds
            And the "stop" playback buttons "should not" be enabled
            And the "play" playback buttons "should" be enabled
