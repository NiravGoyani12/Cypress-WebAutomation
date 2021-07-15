// eslint-disable-next-line
/// <reference path="../../support/index.d.ts" />
import { Given, Then, And } from 'cypress-cucumber-preprocessor/steps';
import { 
    getAndOpenPanel,
    findAndOpenDialog,
    findAndCloseDialog,
    openDialog
} from '../../support/utils';
import { IPanelContext, IDialogContext } from '../../support/types';

let databaseWiped = false;

Given('we have a dialog open', (context: any) => {
    const data: IDialogContext = context.hashes()[0];
    openDialog(data);
});

Given('we focus on the {string} panel', (panel) => {
    cy.focusOnPanel(panel);
});

Then('the {string} panel {string} be open', (panel: string, assertion: string) => {
    const test = assertion === 'should' ? 'be.visible' : 'not.be.visible';
    cy.get(`#${panel}.panel`).should(test);
});

Given('we have the {string} dialog open', (dialog: string, context: any) => {
    const data: IDialogContext = context.hashes()[0];
    data.dialog = dialog;
    openDialog(data);
});

Given('we open the {string} panel', (panel, context: any) => {
    const data: IPanelContext = context.hashes()[0];
    data.panel = panel;
    getAndOpenPanel(data);
});

Given('we open the {string} dialog in the current panel', (dialog: string) => {
    findAndOpenDialog(cy.getPanelInFocus(), dialog);
});

Given('we close the {string} dialog in the current panel', (dialog: string) => {
    findAndCloseDialog(cy.getPanelInFocus(), dialog);
});

Then('the {string} dialog in the current panel {string} be open', (dialog: string, assertion: string) => {
    const dialogComponent = cy.getPanelInFocus().find(`[name="${dialog.toLowerCase().replace(RegExp(' ', 'g'), '_')}"]`);
    expect(dialogComponent).not.be.undefined;
    dialogComponent.closest('header')
        .find('[class^=marker]').first()
        .then(($el) => {
            const span = $el[0].querySelector('span');
            const classList = span ? Array.from(span.classList) : [];
            const open = classList.some((klass) => {
                return klass.indexOf('headerOpen') >= 0;
            });
            expect(open).to.be.equal((assertion.toLowerCase() === 'should'));
        });
});

Given('we close the current panel', () => {
    cy.getDialogButton('dialogcancel').click({ force: true });
    cy.wait(1000);
});

And('we wipe the database', () => {
    cy.wipeDatabase();
});

And('we wipe the database once only', () => {
    if (!databaseWiped) {
        cy.wipeDatabase();
        databaseWiped = true;
    }
});

And('we wipe the database silently', () => {
    cy.wipeDatabase(true);
});

Given('we reset the "database wiped" flag', () => {
    databaseWiped = false;
});

Then('we open the {string} panel group', (component) => {
    cy.getPanelGroup(component).click();
});

Then('we open the {string} sub menu', (component) => {
    cy.openPanelOption(component);
});

Then('we click on the {string} panel menu option in the {string} sub menu', (component, panelOption) => {
    cy.openPanel(panelOption, component);
});

