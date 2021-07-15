// eslint-disable-next-line
/// <reference path="../../support/index.d.ts" />

import { Then, When } from 'cypress-cucumber-preprocessor/steps';
import { propertyName } from '../../support/utils';

When('we put {string} in the {string} field', (invalidValue: string, property: string) => {

    cy.getInputField(propertyName(property))
        .clear({ force: true })
        .type(invalidValue, { force: true })
        .blur(); 
});

Then('the error summary {string} contain {string}',(assertion: string, label: string) => {

    const test = assertion === 'should' ? 'contain' : 'not.contain';   

    cy.getPanelInFocus()
        .find('main')
        .find('[class^=error_]')
        .should(test, label);   
});
