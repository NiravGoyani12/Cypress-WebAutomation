Feature: Database manipulation

  we want to load databases
  Background:
    Given we have a known good system
    And we are logged in as "factory" with password "fotechf00"
    And we click the "menuToggler" status bar button

        Scenario: Load a database
            Given we select the "cypress_farm" snapshot for import
            And we start the import process
            Then the application becomes busy
            And we wait 10 seconds
            Then the application reloads
            And we wait for the UI to load

        Scenario: Load a database with fewer steps
            Given we load the "cypress_farm" snapshot
            Then the application becomes busy
            And we wait 10 seconds
            Then the application reloads
            And we wait for the UI to load
