// eslint-disable-next-line
/// <reference path="../../../../support/index.d.ts" />

import { Then } from 'cypress-cucumber-preprocessor/steps';
 
Then('we select the {string} snapshot for import', (snapshot: string) => {
    cy.selectDatabaseForImport(snapshot);
});

Then('we start the import process', () => {
    cy.startImportProcess();
});
