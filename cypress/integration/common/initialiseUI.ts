// eslint-disable-next-line
/// <reference path="../../support/index.d.ts" />
import { Given, Then, And } from 'cypress-cucumber-preprocessor/steps';
import { World } from '../../support/world';

Given('we have a known good clean system logged in as {string} with password {string}', async (username: string, password: string) => {
    if (!World.cache.loggedIn) {
        cy.knownGoodSystem();
        await cy.login(username, password);
        cy.waitUntilUILoaded();
        cy.wipeDatabase(true);
        cy.clickStatusBarButton('menuToggler');
        World.cache.loggedIn = true;
    }
});

Given('we have a known good clean system logged in as {string} with password {string} with database {string}', async (username: string, password: string, snapshot: string) => {
    if (!World.cache.loggedIn) {
        cy.knownGoodSystem();
        await cy.login(username, password);
        cy.waitUntilUILoaded();
        cy.clickStatusBarButton('menuToggler');
        cy.importDatabase(snapshot);
        cy.get('#app .v-overlay').first().should('be.visible');
        cy.get('#splash', { timeout: 90000 }).should('be.visible');
        cy.waitUntilUILoaded();
        cy.clickStatusBarButton('menuToggler');
        World.cache.loggedIn = true;
    }
});

Given('we have a known good system', () => {
    cy.knownGoodSystem();
});

Given('we have a known good system and are not logged in', () => {
    cy.initialiseUI();
});

Then('we wait for the UI to load', () => {
    cy.waitUntilUILoaded();
});

And('we are logged in as {string} with password {string}', async (username: string, password: string) => {
    World.cache = { auth: { username, password } };
    cy.get('#statusBar', { timeout: 10000 })
        .then(async () => {
            if (Cypress.$('#username').length === 0) {
                await cy.login(username, password, '/');
                cy.waitUntilUILoaded();
            }
            cy.get('#username')
                .then(async (name) => {
                    if (name.text() !== username) {
                        await cy.login(username, password, '/');
                        cy.waitUntilUILoaded();
                    }
                });
        });
});
