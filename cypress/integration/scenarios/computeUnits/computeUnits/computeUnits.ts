// eslint-disable-next-line
/// <reference path="../../../../support/index.d.ts" />
import { Then } from 'cypress-cucumber-preprocessor/steps';
import { propertyName } from '../../../../support/utils';
import { assertVisible } from '../../../../support/utils';

Then('the {string} property should have a {string} button and it {string} be visible and {string} be enabled', (property: string, id: string,visibleAssertion: string, assertion: string) => { 
    
    const visibilityTest = visibleAssertion === 'should';
    const test = assertion === 'should' ? 'be.enabled' : 'not.be.enabled';

    cy.get('#aspects_computeunit_new')
        .find(`[data-property='${propertyName(property)}']`) 
        .find('[class^=additionalWrapper_]')     
        .find('button')
        .should('exist')
        .should(test)                      
        .contains(id)
        .then($el => {
            assertVisible($el.get(0), visibilityTest);
        });        
});
