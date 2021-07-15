// eslint-disable-next-line
/// <reference path="../../../../support/index.d.ts" />

import { Then, When, And } from 'cypress-cucumber-preprocessor/steps';
import { World } from '../../../../support/world';
import { assertVisible } from '../../../../support/utils';

export const navigateToSuppressionZone = (stream: string): Cypress.Chainable<JQuery<HTMLElement>> => {
    return cy.get('[name="suppression"]')
        .closest('[class^=title_]')
        .find('[data-property="eventDetection.processing.signalSuppressionZone"]')
        .find('.items')
        .find('li').contains(stream)
        .click({ force: true })
        .closest('[class^=repeated]')
        .find('.entries')
        .find('.active');
};

export const getActiveSuppressionZone = (): Cypress.Chainable<JQuery<HTMLElement>> => {
    return cy.get('[name="suppression"]')
        .closest('[class^=title_]')
        .find('[data-property="eventDetection.processing.signalSuppressionZone"]')
        .find('.entries')
        .find('.active');
};

When('we add a new suppression zone for the {string} stream with lower value of {string} and upper value of {string}', (stream: string, lower: string, upper: string) => {

    lower = (lower === '[blank]') ? ' ' : lower;
    upper = (upper === '[blank]') ? ' ' : upper;

    navigateToSuppressionZone(stream)
        .find('[class^=add_]')
        .click({ force: true })
        .closest('[class^=multiple_]')
        .find('[class^=value]')
        .find('input').first()
        .focus()
        .type(lower)
        .parent()
        .next().next()
        .find('input')
        .type(upper, { force: true }).blur();

});

Then('the notes section for the {string} stream first value {string} be visible', async(stream: string, assertion: string) => {
    navigateToSuppressionZone(stream)
        .find('.range')
        .first()
        .children('.notesSection')
        .then($el => {
            const visible = (assertion === 'should');
            assertVisible($el.get(0), visible);
        });
});

Then('the {string} stream should have the lower value of {string} and upper value of {string}', (stream: string, lowerValue: string, upperValue: string) => {
    
    navigateToSuppressionZone(stream)
        .find('[class^=add_]')
        .closest('[class^=multiple_]')
        .find('[class^=value]')
        .find('input').first()
        .should('have.value', lowerValue);
                
    navigateToSuppressionZone(stream)
        .find('[class^=add_]')
        .closest('[class^=multiple_]')
        .find('[class^=value]')
        .find('input').last()
        .should('have.value', upperValue);
});

When('we click the Select Visually button', () => { 
    cy.get('button span').contains('select visually', { matchCase: false }).parent().as('visualSelection');
    cy.get('@visualSelection').click({ force: true });
    cy.get('@visualSelection').invoke('text').should('eq', 'CANCEL SELECTION');
});

When('select a range in the Waterfall canvas', () => { 
    // Select some area inside the waterfall window
    cy.get('#waterfall_canvas')
        .then(element => {
            cy.wrap(element)
                .trigger('mousedown', { which: 1, pageX: 100, pageY: 300, force: true })
                .trigger('mousemove', { which: 1, clientX: 200, clientY: 300, force: true })
                .trigger('mouseup', { which: 1, clientX: 200, clientY: 300, force: true });
        });
});

And('we cache the amount of existing suppression ranges in the {string} stream', (stream: string) => { 

    navigateToSuppressionZone(stream)
        .find('[class^=multiple_]')
        .invoke('text')
        .then((text) => {
            cy.log(text);
            if (text.includes('no data')) {
                World.cache.RangesAmountBefore = 0;
            } else {
                navigateToSuppressionZone(stream)
                    .find('[class^=range_]')
                    .its('length')
                    .then((length) => {
                        World.cache.RangesAmountBefore =  length;
                    });
            }
        });
});

Then('a new range with non-empty values should appear in the active stream', () => {

    getActiveSuppressionZone().as('activeStream');

    // Scroll into view of the last range
    cy.get('@activeStream')
        .find('[class^=range_]').last()
        .scrollIntoView();

    // Check the amount of ranges incremented by 1
    cy.get('@activeStream')
        .find('[class^=range_]')
        .its('length')
        .then((rangesAmountNow) => {
            expect(rangesAmountNow - World.cache.RangesAmountBefore, 'amount of ranges now should increment by 1').to.eq(1);
        });

    // Check the ranges are not empty

    // get the last range
    cy.get('@activeStream')
        .find('[class^=range_]').last()
        .find('[class^=value]').as('lastRangeFields');

    cy.get('@lastRangeFields')
        .find('input').first()
        .invoke('val')
        .then(parseFloat)
        .then((actLowerRange) => {
            expect(actLowerRange, 'lower range should be greater than 0').to.gt(0);
            
            cy.get('@lastRangeFields')
                .find('input').last()
                .invoke('val')
                .then(parseFloat)
                .then((actUpperRange) => {
                    expect(actUpperRange, 'upper range should be greater than 0').to.gt(0);
                    expect(actUpperRange, 'the upper range should be greater than lower range').to.gt(actLowerRange);
                });

        });
});


When('we remove the new suppression zone for the {string} stream', (stream: string) => {
    navigateToSuppressionZone(stream)
        .find('[class^=remove_]')
        .click({ force: true });       
});

