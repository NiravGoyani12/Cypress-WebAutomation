// eslint-disable-next-line
/// <reference path="../../../../support/index.d.ts" />

import { Then, When, And } from 'cypress-cucumber-preprocessor/steps';
import { World } from '../../../../support/world';
import { Store } from 'vuex';
import { getStore } from '../../../../support/utils';

When('we click on the new zone button', () => {

    cy.get('#newZoneButton')
        .find('a')
        .click({ force: true });

});

Then('we enter a zone named {string} from {int} to {int}', (zoneName: string, from: number, to: number) => {
    const zoneCache: any = {};
    zoneCache[zoneName] = { zoneFrom: from, zoneTo: to };
    World.cache = zoneCache;
    cy.get('#non_blocking_prompt_dialog').as('dialog')
        .find('#non_blocking_prompt_value')
        .type(zoneName)
        .blur();
    cy.get('@dialog')
        .find('#nonBlockingPromptDialogSubmit')
        .click();
    cy.get('#headToolTipwaterfall_canvas')
        .clear({ force: true })
        .type(from.toString(), { force: true });
    cy.get('#tailToolTipwaterfall_canvas')
        .clear({ force: true })
        .type(to.toString(), { force: true });
    cy.get('#shadowConfirmwaterfall_canvas')
        .find('#shadowConfirmSubmit')
        .click({ force: true });
    cy.get('#zone_dialog_zone_filter').focus();
});

And('we can zoom to the {string} zone successfully', (zoneName: string) => {
    
    getStore().then(async (store: Store<any>) => {
        cy.get('#zoneDialogBody')
            .find('table')
            .contains('td', zoneName)
            .closest('tr') 
            .invoke('attr', 'id')
            .then((id) => {
                const zone = id ? id.split('_').pop() : '';
                if (!zone) {
                    throw new Error(`Unable to find zone ${id}`);
                }
                cy.get(`#${zone}_zone_zoom`)
                    .click({ force: true });
                // Let the zooming take place
                cy.wait(1000);
                // Calculate the padding and expected start/end positions
                let zoneLength = World.cache[zoneName].zoneFrom - World.cache[zoneName].zoneTo;
                if (zoneLength < 0) {
                    zoneLength = zoneLength * -1;
                }
                const fibreLength = store.state.aspects.aspects.channel['1'].length;
                const padding = Math.max(1.0, (zoneLength * 0.05));
                const newStartPos = World.cache[zoneName].zoneFrom - padding;
                const newEndPos = Math.min(fibreLength.value, (newStartPos + zoneLength + (2 * padding)));

                cy.window()
                    .its('fibreGraphCanvas')
                    .then((fibreGraphCanvas) => {
                        expect(fibreGraphCanvas.displayStartPos).to.be.equal(newStartPos);
                        expect(fibreGraphCanvas.displayEndPos).to.be.equal(newEndPos);
                    });

            });
    });

});
