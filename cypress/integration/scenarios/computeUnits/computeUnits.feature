Feature: Compute unit

    we want to check for the look up button

 Scenario: Make sure that the 'lookup' button exists
    Given we have a known good system
    And we are logged in as "factory" with password "fotechf00"
    Given we click the "menuToggler" status bar button 

   # Given we open the "Compute Units" panel
   #   | panelGroup|
   #   | Settings  |

    # Now redundant. We need to revisit these.
    # When we click on the "add" dialog button 
    # Then the "Host Name" property should have a "lookup" button and it "should" be visible and "should" be enabled
 
    