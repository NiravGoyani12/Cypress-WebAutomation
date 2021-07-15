
import { Then } from 'cypress-cucumber-preprocessor/steps';

Then('the username is {string}', (username: string) => {
    cy.get('#username')
        .contains(username, { matchCase: false });
});
