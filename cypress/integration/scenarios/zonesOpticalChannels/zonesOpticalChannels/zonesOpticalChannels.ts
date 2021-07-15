// eslint-disable-next-line
 /// <reference path="../../../../support/index.d.ts" />
import { When, Then } from 'cypress-cucumber-preprocessor/steps';
import { IZoneButtonState } from '../../../../support/types';

Then('the zone buttons should be in the correct state', (context: any) => {
    context.hashes().forEach((line: IZoneButtonState) => {
        cy.log(`Zone: '${line.zone}' Button: '${line.button}' should be ${line.state}`);
        getZone(line.zone)
            .as('zoneRow');
        const assertion = line.state.toLowerCase() === 'enabled' ? 'not.have.class' : 'have.class';
        getZoneManipulationButton(line.button, cy.get('@zoneRow'))
            .should(assertion, 'disabled'); 
    } ); 
});

When('we click on the {string} button in the {string} zone row', (buttonName: string, zone: string) => {
    getZone(zone)
        .as('zoneRow');
    getZoneManipulationButton(buttonName, cy.get('@zoneRow'))
        .click({ force: true });
});

When('we click on the {string} button in the zone', (buttonName: string, context: any) => {
    context.hashes().forEach((line: any) => {
        getZone(line.zone)
            .as('zoneRow');
    } ); 
    getZoneManipulationButton(buttonName, cy.get('@zoneRow'))
        .click({ force: true });
    cy.wait(900);
});

// Get a button in the zone row
function getZoneManipulationButton(buttonName: string, zoneRow: Cypress.Chainable<JQuery<Element>>): Cypress.Chainable<JQuery<HTMLElement>> {
    let buttonId = '';
    switch (buttonName) {
        case 'Start Logging':
            buttonId = '_zone_logging_on';
            break;
        case 'Stop Logging':
            buttonId = '_zone_logging_off';
            break;
        default:
            throw new Error(`Unknown name of button: ${buttonName}`);
    }
    return zoneRow
        .find(`[id*=${buttonId}]`);
}
// Get a zone row in the dialog
function getZone(zone: string): Cypress.Chainable<JQuery<Element>> {
    return cy.get('.zone_list_dialog_description')
        .contains(zone)
        .parent().parent()
        .scrollIntoView();
}