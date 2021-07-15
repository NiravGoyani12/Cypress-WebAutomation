Feature: Unit conversion Accuracy

    Background:
        Given we have a known good system
        And we are logged in as "admin" with password "admin"
        And we click the "menuToggler" status bar button

    Scenario Outline: As a user changing the preferences from one unit to another should result in the correct converted Monitor length
        Given we set the following preferences
            | name     | value       | type   |
            | Distance | <orig_unit> | select |
        And we open the "Channels" panel group
        And we open the "Optical Channel 1" sub menu
        And we click on the "Channel properties" panel menu option in the "Optical Channel 1" sub menu
        When we put "<orig_length>" in the "Physical fibre length" field
        And we set the following preferences
            | name     | value        | type   |
            | Distance | <final_unit> | select |
        And we focus on the "Channel properties" panel
        Then we expect the filled value to be "<final_length>" in the "Physical fibre length" dialog field
        And  the "Physical fibre length" field should contains "<unit>"

        Examples:
            | orig_length | orig_unit  | final_unit | final_length      | unit |
            | 2000        | Metres     | Feet       | 6561.679833333333 | ft   |
            | 1           | Miles      | Feet       | 5280.000036864706 | ft   |
            | 1000        | Feet       | Kilometres | 0.30479999798832  | km   |
            | 2           | Kilometres | Metres     | 2000              | m    |
