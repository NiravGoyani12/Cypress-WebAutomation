// in cypress/support/index.d.ts
// load type definitions that come with Cypress module

// eslint-disable-next-line
/// <reference types="cypress" />
// eslint-disable-next-line
/// <reference types="node" />

declare module '@cypress/browserify-preprocessor';
declare module 'cypress-log-to-output'

declare namespace Cypress {
    interface Chainable {
        debug(data: any): void
        knownGoodSystem(): Chainable<Element>
        getElementById(id: string): Chainable<Element>
        getField(id: string, type: string): Chainable<Element>
        getInputField(id: string): Chainable<Element>
        getSelectField(id: string): Chainable<Element>
        getToggleField(id: string): Chainable<Element>
        clickToggleField(id: string): Chainable<Element>
        waitUntilUILoaded(): Chainable<Element>;
        initialiseUI(): Chainable<Element>;
        getButton(id: string): Chainable<Element>;
        getDialogButton(id: string): Chainable<Element>;
        getDialogActiveIndicator(): Chainable<Element>;
        modalPopupShouldAppear(title: string, timeout?: number): Chainable<Element>;
        getModalPopupButton(id: string): Chainable<Element>;
        clickStatusBarButton(id: string): Chainable<Element>;
        flyoutVisible(id: string): Chainable<Element>;
        flyoutNotVisible(id: string): Chainable<Element>;
        clickServiceToggle(id: string): Chainable<Element>;
        getPanelGroup(id: string): Chainable<Element>;
        openPanelOption(id: string): Chainable<Element>;
        openPanel(panelOption: string, id: string): Chainable<Element>;
        focusOnPanel(id: string): Chainable<Element>;
        getPanelInFocus(): Chainable<Element>;
        assertDatabaseValue(data: any, field: string, value: any, convert?: any): Chainable<Element>;
        wipeDatabase(silently?: boolean): void;
        importDatabase(snapshot: string): void;
        selectDatabaseForImport(snapshot: string): void;
        startImportProcess(): void;
        resetDialog(): void;
        logout(): void;
        login(username: string, password: string, redirectTo?: string): void;
        getPlaybackProgressBar(): Cypress.Chainable<JQuery<Element>>;
        addFibreSegmentCalibration(channel: string, monitorStart: number, monitorEnd: number, cableStart: number, instance: number): void;
        selectFdelDisplayMode(mode: string): void;
        clickButtonInFdelToolbar(buttonName: string): void;
    }
}
