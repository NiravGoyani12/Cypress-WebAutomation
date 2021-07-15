Feature: Zones Optical Channel
    Manage zones via Optical Channel dialog

    Scenario: We are able to cancel all active zone logging
        Given we have a known good clean system logged in as "factory" with password "fotechf00" with database "cypress_farm"
        And we open the "Zones" panel
            | panelGroup |
            | Channels   |
        When we click on the "Start Logging" button in the zone
            | zone         |
            | JB           |
            | Fence        |
            | Field        |
            | Field Corner |
            | General      |
            | Road         |
        And we click on the "zoneDialogStopLogging" button
        Then the zone buttons should be in the correct state
            | zone         | button        | state    |
            | JB           | Start Logging | enabled  |
            | JB           | Stop Logging  | disabled |
            | Fence        | Start Logging | enabled  |
            | Fence        | Stop Logging  | disabled |
            | Field        | Start Logging | enabled  |
            | Field        | Stop Logging  | disabled |
            | Field Corner | Start Logging | enabled  |
            | Field Corner | Stop Logging  | disabled |
            | General      | Start Logging | enabled  |
            | General      | Stop Logging  | disabled |
            | Road         | Start Logging | enabled  |
            | Road         | Stop Logging  | disabled |
