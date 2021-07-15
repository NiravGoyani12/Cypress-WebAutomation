Feature: System preferences

    Background: 
            Given we have a known good system
            And we are logged in as "admin" with password "admin"
            And we click the "menuToggler" status bar button
  
        Scenario: We can maintain the preferences
            Given we set the following preferences
                | name          | value    | type      |
                | Orientation   | vertical | select    | 
            And we refresh the page
            And we click the "menuToggler" status bar button
            Then the preferences are as expected

            Given we set the following preferences
                | name          | value      | type      |
                | Orientation   | horizontal | select    | 
            And we refresh the page
            And we click the "menuToggler" status bar button
            Then the preferences are as expected

        