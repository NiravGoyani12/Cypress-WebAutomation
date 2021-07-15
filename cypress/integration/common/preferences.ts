// eslint-disable-next-line
/// <reference path='../../support/index.d.ts' />
import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { IPreference, FieldType } from '../../support/types';
import { 
    getAndOpenPanel,
    propertyName
} from '../../support/utils';
import { World } from '../../support/world';

Given('we set the following preferences', (context: any) => {
    World.cache = { preferences: context };
    getAndOpenPanel({ panelGroup: 'Settings', panel: 'Preferences' });
    context.hashes().forEach((line: IPreference) => {
        switch (line.type) {
            case FieldType.Dropdown:
                cy.get(`[name=${propertyName(line.name)}`)
                    .select(line.value, { force: true })
                    .blur();
                break;
            default:
                cy.get(`[name=${propertyName(line.name)}`)
                    .clear()
                    .type(line.value)
                    .blur();
        }
    }); 
    cy.getPanelInFocus()
        .find('.v-btn#save')
        .click({ force: true });
});

Then('the preferences are as expected', () => {
    const context: any = World.cache.preferences;
    getAndOpenPanel({ panelGroup: 'Settings', panel: 'Preferences' });
    context.hashes().forEach((line: IPreference) => {
        cy.get(`[name=${propertyName(line.name)}`)
            .should('have.value', line.value);
    }); 
});
