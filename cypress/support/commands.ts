// eslint-disable-next-line
/// <reference path="./index.d.ts" />
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//

import { propertyName, getAndOpenPanel, getStore } from './utils';
import { IPanelContext } from './types';
import { World } from './world';
import { Store } from 'vuex';

const cleanId = (id: string): string => {
    return propertyName(id).toLowerCase().replace(RegExp(' ', 'g'), '_');
};

Cypress.Commands.add('debug', (data: any ) => {
    cy.writeFile('./cypress/logs/debug', data);
});

Cypress.Commands.add('waitUntilUILoaded', () => {
    cy.get('#splash', { timeout: 90000 }).should('not.be.visible');
});

Cypress.Commands.add('getElementById', (id) => {
    cy.get(`#${id}`);
});

Cypress.Commands.add('getField', (id: string, type: string) => {
    cy.getPanelInFocus()
        .find(`[data-property="${propertyName(id)}"] ${type}`);
});

Cypress.Commands.add('getInputField', (id) => {
    cy.getField(id, 'input');
});

Cypress.Commands.add('getSelectField', (id) => {
    cy.getField(id, 'select');
});

Cypress.Commands.add('getDialogButton', (id) => {
    cy.getPanelInFocus()
        .find(`#${id}.v-btn`);
});

Cypress.Commands.add('getDialogActiveIndicator', () => {
    cy.getPanelInFocus()
        .find('[class^=active_]')
        .find('div');
});

Cypress.Commands.add('knownGoodSystem', () => {
    cy.visit('/');
    cy.waitUntilUILoaded();
    cy.title().should('include', 'Helios');
});

Cypress.Commands.add('initialiseUI', () => {
    cy.knownGoodSystem();
    World.deleteCache('auth');
    cy.logout();
});

Cypress.Commands.add('login', (username: string, password: string, redirectTo?: string) => {
    getStore().then(async (store) => {
        const ok = await store.dispatch('aspects/login', { username, password, redirect: false });
        if (ok) {
            if (redirectTo) {
                cy.visit(redirectTo);
            } else {
                cy.visit('/');
            }
            cy.waitUntilUILoaded();
        }
    });
});

Cypress.Commands.add('logout', () => {
    getStore().then(store => {
        store.dispatch('aspects/logout');
    });
});

Cypress.Commands.add('getButton', (id) => {
    cy.get(`#${id}.v-btn`);
});

Cypress.Commands.add('getModalPopupButton', (id) => {
    cy.get(`.v-dialog #${id}.v-btn`);
});

Cypress.Commands.add('clickServiceToggle', (id) => {
    cy.get(`#${id}[class^=servicetoggle] .v-input--selection-controls__input`)
        .click();
});

Cypress.Commands.add('getToggleField', (id) => {
    cy.get(`[data-property="${id}"]`)
        .find('[data-property-type="Boolean"]');
});

Cypress.Commands.add('clickToggleField', (id) => {
    cy.getToggleField(id)
        .find('[class*=clickable_]')
        .click({ force: true });
    cy.wait(1000);
});

Cypress.Commands.add('clickStatusBarButton', (id) => {
    cy.get(`#${id}`)
        .click();
});

Cypress.Commands.add('flyoutVisible', (id) => {
    cy.get(`#${id} > #statusdetails > div`)
        .should('be.visible');
});

Cypress.Commands.add('flyoutNotVisible', (id) => {
    cy.get(`#${id} > #statusdetails > div`)
        .should('not.be.visible');
});

Cypress.Commands.add('getPanelGroup', (id) => {
    cy.get(`[data-panel-id="${id}"] > Section header`).first();
});

Cypress.Commands.add('openPanelOption', (id) => {
    cy.get(`[name=${cleanId(id)}]`)
        .find('header [class^=marker]').first()
        .then(($el) => {
            const span = $el[0].querySelector('span');
            const classList = span ? Array.from(span.classList) : [];
            const open = classList.some((klass) => {
                return klass.indexOf('headerOpen') >= 0;
            });
            if (!open) {
                $el[0].click();
            }
        });
});

Cypress.Commands.add('openPanel', (panelOption, id) => {
    cy.get(`[name=${cleanId(panelOption)}]`)
        .find(`[panel-name="${propertyName(id)}"]`).click();
});

Cypress.Commands.add('focusOnPanel', (id: string) => {
    cy.get(`[panel-name="${id}"]`)
        .find('.ft-panel')
        .trigger('mousedown');
});

Cypress.Commands.add('getPanelInFocus', () => {
    getStore().then(store => {
        const filtered = store.state.panels.order.filter((panel: string) => panel !== 'waterfall_0' && panel !== 'About this {{name}} unit');
        const current = filtered[filtered.length - 1].replace(RegExp('/', 'g'), '_').replace(RegExp(' ', 'g'), '_');
        cy.getElementById(current);
    });
});

Cypress.Commands.add('assertDatabaseValue', (data: any, field: string, value: any, convert?: any) => {
    const prop = data[field] ? data[field] : data.properties[field];
    if (!convert && ['Number', 'Integer'].indexOf(prop.type) >= 0) {
        convert = parseFloat;
    }
    if (convert) {
        try {
            value = convert(value);
        } catch (err) {
            // Well, that didn't work out so well. We can let the test fail
            // if the unconverted value results in such
        }
    }
    expect(value).to.be.equal(prop.value);
});

Cypress.Commands.add('wipeDatabase', (silently?: boolean) => {
    if (silently) {
        getStore().then({ timeout: 10000 }, async (store: Store<any>) => {
            await store.dispatch('system/wipe_database', {
                username: 'factory',
                password: 'fotechf00',
                noToken: true
            });
            cy.wait(1000);
            cy.visit('/');
            cy.waitUntilUILoaded();
        });
    } else {
        cy.getPanelGroup('Database').click();
        cy.get('#wipe_database').click();
        cy.modalPopupShouldAppear('Are you sure?');
        cy.getModalPopupButton('ok').click();
        cy.wait(2000);
        cy.modalPopupShouldAppear('Database has been updated', 30000);
        cy.getModalPopupButton('ok').click();
        cy.visit('/');
        cy.waitUntilUILoaded();
        cy.clickStatusBarButton('menuToggler');
    }
});

Cypress.Commands.add('selectDatabaseForImport', (snapshot: string): void => {
    const data: IPanelContext = {
        panelGroup: 'Database',
        panel: 'Snapshots'
    };
    getAndOpenPanel(data);
    cy.getPanelInFocus()
        .find('#snapshotFiles')
        .find(`[id="/${snapshot}"]`)
        .find('.importButton')
        .then(($el) => {
            // Using the Cypress .click() won't work here
            // because the click modifies the element itself
            $el[0].click();
        });
});

Cypress.Commands.add('startImportProcess', (): void => {
    cy.getPanelInFocus()
        .find('[name="full_restore_import_system_properties"]')
        .click({ force: true })
        .closest('.panel')
        .find('#snapshotImportDialogSubmit')
        .click({ force: true });
});

Cypress.Commands.add('importDatabase', (snapshot: string): void => {
    cy.selectDatabaseForImport(snapshot);
    cy.startImportProcess();
});

Cypress.Commands.add('modalPopupShouldAppear', (title: string, timeout?: number): void => {
    const options = {} as any;
    if (timeout) {
        options.timeout = timeout;
    }
    cy.get('.v-dialog .v-list-item__title', options)
        .should('be.visible')
        .contains(title);
});

Cypress.Commands.add('resetDialog', () => {
    cy.getDialogButton('dialogreset')
        .should('not.be.disabled')
        .click({ force: true });

    cy.modalPopupShouldAppear('Abandon changes');

    cy.getModalPopupButton('ok')
        .click();
    
});

Cypress.Commands.add('getPlaybackProgressBar', (): Cypress.Chainable<JQuery<Element>> => {
    return cy.get('#panel_dock_Playback')
        .find('[class^=progress_]');
});

Cypress.Commands.add('addFibreSegmentCalibration', (channel: string, monitorStart: number, monitorEnd: number, cableStart: number, instance: number) => {
    
    const channelProperty = `acquisition\\\\.fibreSegment([\\\\d]+)/${instance}/ADCChannel`;
    const monitorStartProperty = `acquisition\\\\.fibreSegment([\\\\d]+)/${instance}/monitorStart_m`;
    const monitorEndProperty = `acquisition\\\\.fibreSegment([\\\\d]+)/${instance}/monitorEnd_m`;
    const cableStartProperty = `acquisition\\\\.fibreSegment([\\\\d]+)/${instance}/start_m`;
    
    cy.getSelectField(channelProperty)
        .select(channel, { force: true });

    cy.getInputField(monitorStartProperty)
        .clear({ force: true })
        .type(monitorStart.toString(), { force: true });

    cy.getInputField(monitorEndProperty)
        .clear({ force: true })
        .type(monitorEnd.toString(), { force: true });

    cy.getInputField(cableStartProperty)
        .clear({ force: true })
        .type(cableStart.toString(), { force: true })
        .blur();

});

Cypress.Commands.add('selectFdelDisplayMode', (mode: string): void => {
    cy.get('.maintoolbar .displayTypeSelector')
        .find('.nestedmenulist span')
        .contains(mode)
        .invoke('show')
        .click({ force: true });

    cy.wait(1000); // to let the circle icon to appear

    // Wait for "pending display mode" icon to disappear
    cy.get('.maintoolbar .displayTypeSelector')
        .find('[role=progressbar]', { timeout: 10000 })
        .should('have.attr', 'style')
        .should(t => expect(t).to.contain('display: none'));
});

Cypress.Commands.add('clickButtonInFdelToolbar', (buttonName: string): void => {
    cy.get('.core.menuButton.noprint.coreTooltip')
        .contains(buttonName)
        .invoke('show')
        .click({ force: true });
    cy.wait(3000); // until the pause ia applied fully
});
