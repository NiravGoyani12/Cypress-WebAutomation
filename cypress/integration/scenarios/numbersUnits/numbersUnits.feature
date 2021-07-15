Feature: Numbers and units

    Background:
        Given we have a known good clean system logged in as "factory" with password "fotechf00"
        And we have the "Acoustic" dialog open
            | panelGroup | panelOption       | panel              |
            | Channels   | Optical Channel 1 | Channel properties |
        And we enter "3" in the "Acoustic high pass cut off" dialog field
        Then we click on the "apply" dialog button
        Then we enter "2" in the "Acoustic high pass cut off" dialog field
        And we click on the "apply" dialog button

    Scenario Outline: We change the value in the PRF field then the units to be correct on refresh
        Given we have the "Optics" dialog open
            | panelGroup | panelOption       | panel              |
            | Channels   | Optical Channel 1 | Channel properties |
        And we select "<initial units>" dropdown in the "<field>" field
        And we enter "<initial value>" in the "<field>" dialog field
        And we click on the "save" dialog button
        When we refresh the page
        And the "menuToggler" component "is" visible
        And we click the "menuToggler" status bar button
        And we have the "Optics" dialog open
            | panelGroup | panelOption       | panel              |
            | Channels   | Optical Channel 1 | Channel properties |
        Then we expect the filled value to be "<final value>" in the "<field>" dialog field
        And we expect the units to be "<final units>" in the "<field>" field

        Examples:
            | field                             | initial value | initial units | final value | final units |
            | Optics pulse repetition frequency | 1000          | Hz           | 1           | kHz        |
            | Optics pulse repetition frequency | 0.010         | kHz          | 10          | Hz         |
            | Optics pulse repetition frequency | 0.1           | kHz          | 100         | Hz         |
            | Optics pulse repetition frequency | 0.999         | kHz          | 999         | Hz         |
            | Optics pulse repetition frequency | 999.9         | Hz           | 999.9       | Hz         |
            | Optics pulse repetition frequency | 10.001        | Hz           | 10.001      | Hz         |
