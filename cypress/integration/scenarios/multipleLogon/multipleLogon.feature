Feature: Example of logging on with different users

    Scenario Outline: Example of logging on with different users
        Given we have a known good system
        And we are logged in as "<username>" with password "<password>"
        And we click the "menuToggler" status bar button

        Examples:
        | username      | password    |
        | factory       | fotechf00   |
        | admin         | admin       |
