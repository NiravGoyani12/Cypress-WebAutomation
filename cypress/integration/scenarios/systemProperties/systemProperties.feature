Feature: We are able to set all the system properties

    Background:
        Given we have a known good system and are not logged in

    Scenario: We can generate a new system UUID
        Given we are logged in as "factory" with password "fotechf00"
        And we click the "menuToggler" status bar button
        And we have the "Identity" dialog open
            | panelGroup | panel             |
            | Settings   | System properties |
        When we click on the UUID generate button
        Then the a valid UUID should be generated
        When we click on the UUID generate button
        Then the UUID should change

    Scenario: I am unable to modify certain fields if I am not Factory
        Given we are logged in as "admin" with password "admin"
        And we click the "menuToggler" status bar button
        And we open the "System properties" panel
            | panelGroup |
            | Settings   |
        Then the fields should be in the correct state
            | dialog   | name                                           | type   | state    |
            | watchdog | Watchdog - After power failure/recovery        | toggle | disabled |
            | watchdog | Watchdog - After software crash                | toggle | disabled |
            | watchdog | Watchdog - After temperatures return to normal | toggle | enabled  |
            | watchdog | Watchdog - After acquisition error             | toggle | disabled |
            | watchdog | Watchdog - On high temperatures                | toggle | disabled |
            | watchdog | Watchdog - On low disk space                   | toggle | disabled |
            | watchdog | Watchdog - Enable recovery                     | toggle | disabled |
            | identity | System name                                    | input  | disabled |
            | identity | System serial number                           | input  | disabled |
            | optics   | Optics trigger level                           | input  | disabled |
            | optics   | Optics box delay                               | input  | disabled |
        And the dialog buttons should be in the correct state
            | button | state    |
            | apply  | disabled |
            | save   | disabled |

    Scenario: We can set certain fields as Factory
        Given we are logged in as "factory" with password "fotechf00"
        And we wipe the database silently 
        And we click the "menuToggler" status bar button
        And we open the "System properties" panel
            | panelGroup |
            | Settings   |
        When we enter these values in the fields and cache the values
            | dialog   | name                 | type    | value          |
            | Identity | System name          | input   | Test machine   |
            | Identity | System serial number | input   | 22334465       |
            | Identity | Custom name          | input   | My custom Name |
            | Identity | Custom id            | input   | 66554434       |
            | Optics   | Optics trigger level | input   | 200            |
            | Optics   | Optics box delay     | input   | 100            |
        And we click on the "apply" dialog button
        Then the apply completes
        When we refresh the page
        And the "menuToggler" component "is" visible
        And we click the "menuToggler" status bar button
        Then we open the "System properties" panel
            | panelGroup |
            | Settings   |
        And the fields should contain the cached values
  
    Scenario Outline: We can set all streaming properties as "<user>"
        Given we are logged in as "<user>" with password "<password>"
        And we wipe the database silently 
        And we click the "menuToggler" status bar button
        And we open the "System properties" panel
            | panelGroup |
            | Settings   |
        When we enter these values in the fields and cache the values
            | dialog    | name                                   | type    | value      |
            | Streaming | Streaming - Raw streaming address      | input   | localhost  |
            | Streaming | Streaming - Raw streaming port         | input   | 12345      |
            | Streaming | Streaming - Acoustic streaming address | input   | localhost  |
            | Streaming | Streaming - Acoustic streaming port    | input   | 6789       |
            | Streaming | Streaming - Phase streaming address    | input   | localhost  |
            | Streaming | Streaming - Phase streaming port       | input   | 223344     |
            | Streaming | Streaming - Raw streaming enabled      | toggle  | on         |
            | Streaming | Streaming - Acoustic streaming enabled | toggle  | on         |
            | Streaming | Streaming - Phase streaming enabled    | toggle  | on         |
        And we click on the "apply" dialog button
        Then the apply completes
        When we refresh the page
        And the "menuToggler" component "is" visible
        And we click the "menuToggler" status bar button
        Then we open the "System properties" panel
            | panelGroup |
            | Settings   |
        And the fields should contain the cached values

        Examples:
            | user    | password  |
            | admin   | admin     |
            | factory | fotechf00 |
