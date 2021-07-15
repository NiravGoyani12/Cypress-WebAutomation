// eslint-disable-next-line
/// <reference path="../../../../support/index.d.ts" />

import { When, And } from 'cypress-cucumber-preprocessor/steps';
import { getDatabase } from '../../../../support/utils';
import { propertyName } from '../../../../support/utils';
import { World } from '../../../../support/world';
 
When('we cache the {string} to {string} and {string} to {string}', (startField: string, startValue: string, endField: string, endValue: string) => {

    World.cache = {
        cachedRange: {
            startField: propertyName(startField),
            endField: propertyName(endField),
            startValue: startValue,
            endValue: endValue
        }
    };

});

And('the soundfield ruler should have the limits {string} and {string}', (startValue: string, endValue: string) => {
    cy.window()
        .its('fibreGraphCanvas')
        .then((fibreGraphCanvas) => {
            expect(fibreGraphCanvas.displayStartPos).to.be.equal(parseFloat(startValue));
            expect(fibreGraphCanvas.displayEndPos).to.be.equal(parseFloat (endValue));
        });
});

When('these properties should be saved in the database', () => {
    getDatabase('channel/1', (response: any) => {
        expect(response.body).to.not.be.undefined;
        cy.assertDatabaseValue(response.body, World.cache.cachedRange.startField, World.cache.cachedRange.startValue);
        cy.assertDatabaseValue(response.body, World.cache.cachedRange.endField, World.cache.cachedRange.endValue);
    });
});
