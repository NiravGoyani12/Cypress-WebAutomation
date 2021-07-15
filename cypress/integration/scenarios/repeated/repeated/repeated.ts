// eslint-disable-next-line
/// <reference path="../../../../support/index.d.ts" />

import { Then, When, then } from 'cypress-cucumber-preprocessor/steps';
import { propertyName } from '../../../../support/utils';
import { assertVisible } from '../../../../support/utils';

When('we click the button to add a new fibre segment calibration', () => {
    cy.get('[name="data_capture"]')
        .closest('[class^=title_]')
        .find('.repeated_group')
        .find('[class^=add_]')
        .click({ force: true })
        .closest('.entries')
        .find('[class^=list]')
        .focus();

});


Then('an error message {string} be visible for the overall {string} section', async (assertion: string, property: string) => {

    cy.get(`[data-property="${propertyName(property)}"]`)
        .children('.repeated').first()
        .children('.notesSection').first()
        .then($el => {
            const errorElement = $el.get(0);
            const visible = (assertion === 'should');
            assertVisible(errorElement, visible);
        })
        .find('[class^=error_]');
});

then('the notes section for {string} {string} be visible', async (containing: string, assertion: string, context: any) => {
    const table = context.hashes();
    const visible = (assertion === 'should');
    for (const data of table) {
        cy.get(`[data-property="${propertyName(containing)}"]`)
            .closest(`[data-type=${data.propertyType}]`)
            .children('[class^=value_]')
            .children('.notesSection')
            .then($el => {
                assertVisible($el.get(0), visible);
            });
    }
});


Then('an error message {string} be present for the individual fibre segment definition', async (assertion: string) => {
    const errors = cy.get(`[data-property="${propertyName('Monitor Start Position')}"]`)
        .closest('[data-property-type=Group]')
        .find('[class^=errors_]');
    if (assertion === 'should') {
        errors.its('length').should('be.gt', 0);
    } else {
        errors.its('length').should('eq', 0);
    }
});
