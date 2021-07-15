// eslint-disable-next-line
/// <reference path="../../support/index.d.ts" />
import { Given, Then, And, When } from 'cypress-cucumber-preprocessor/steps';
import { getDatabase } from '../../support/utils';
import { World } from '../../support/world';

Given('we redirect to {string} authenticated as {string} with password {string}', { timeout: 2 * 5000 }, async (endpoint: string, username: string, password: string) => {
    World.cache = { auth: { username, password } };
    cy.login(username, password, endpoint);
});

And('we wait {int} seconds', (wait) => {
    cy.wait(wait * 1000);
});

Then('then database value for the {string} property of {string} is {string}', (prop: string, aspect: string, value: any) => {
    getDatabase(aspect, (response: any) => {
        expect(response.body).to.not.be.undefined;
        cy.assertDatabaseValue(response.body ,prop, value);
    });
});

When('we load the {string} snapshot', (snapshot: string) => {
    cy.importDatabase(snapshot);
});

Then('the application becomes busy', () => {
    cy.get('#app .v-overlay').first().should('be.visible');
});

Then('the application reloads', () => {
    cy.get('#splash', { timeout: 90000 }).should('be.visible');
});
