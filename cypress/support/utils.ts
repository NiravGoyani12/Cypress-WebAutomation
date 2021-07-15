import aliases from './propertyAliases';
import { Store } from 'vuex';
import { IPanelContext, IDialogContext } from './types';

interface ICallback {
    (response: any): void;
}

export const getStore = (): Cypress.Chainable<Store<any>> => cy.window().its('vueApp.$store');

export const getAndOpenPanel = (data: IPanelContext): Cypress.Chainable | null => {
    cy.getPanelGroup(data.panelGroup).as('panelGroup')
        .find('[class^=marker]').first()
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
    if (data.panel) {
        if (data.panelOption) {
            cy.openPanelOption(data.panelOption);
            return cy.openPanel(data.panelOption, data.panel);
        } else {
            return cy.get('@panelGroup')
                .parent()
                .find(`[panel-name="${propertyName(data.panel)}"]`).click();
        }
    }
    return null;
};

export const findAndActionDialog = (panel: Cypress.Chainable, dialog: string, openIt: boolean): void => {
    panel.find(`[name="${dialog.toLowerCase().replace(RegExp(' ', 'g'), '_')}"]`)
        .closest('header')
        .find('[class^=marker]').first()
        .then(($el) => {
            const span = $el[0].querySelector('span');
            const classList = span ? Array.from(span.classList) : [];
            const open = classList.some((klass) => {
                return klass.indexOf('headerOpen') >= 0;
            });
            if ((!open && openIt) || (open && !openIt)) {
                $el[0].click();
                cy.wait(1000); // Animation
            }
        });
};

export const assertVisible = (element: HTMLElement, visible: boolean): void => {
    const styles = window.getComputedStyle(element);
    const display = styles.getPropertyValue('display');
    if (visible) {
        expect(display).not.to.equal('none');
    } else {
        expect(display).to.equal('none');
    }
};

export const findAndOpenDialog = (panel: Cypress.Chainable, dialog: string): void => {
    findAndActionDialog(panel, dialog, true);
};

export const findAndCloseDialog = (panel: Cypress.Chainable, dialog: string): void => {
    findAndActionDialog(panel, dialog, false);
};

export const openDialog = (data: IDialogContext): void => {
    const panel = getAndOpenPanel(data);
    if (panel) {
        findAndOpenDialog(panel, data.dialog);
    }
};

export function propertyName(alias: string): string {
    return aliases[alias] ? aliases[alias] : alias;
}

export async function fieldHasError(fieldName: string, timeout?: number): Promise<boolean> {
    return new Promise((resolve) => {
        let retries = 0;
        const localTimeout = timeout || 2000;
        const testForErrors = (): void => {
            if (Cypress.$(`[data-property="${propertyName(fieldName)}"] span [class^="error_"]`).length > 0) {
                resolve(true);
            } else {
                retries ++;
                if (retries > (localTimeout / 100)) {
                    resolve(false);
                }
                setTimeout(testForErrors, 100);
            }
        };
        setTimeout(testForErrors, 100);
    });
}

export function apiRequest(endpoint: string, callback?: ICallback, method?: string): void {
    const getStore = (): Cypress.Chainable<Store<any>> => cy.window().its('vueApp.$store');
    getStore().then(async (store: Store<any>) => {
        let url = `api/v1/${endpoint}`;
        // let url = `http://localhost:5000/${endpoint}`;
        const cachebuster = new Date().getTime();
        if (url.indexOf('?') >= 0) {
            url = `${url}&c=${ cachebuster }`;
        } else {
            url = `${url}?c=${ cachebuster }`;
        }
        const lCallback = (response: any): void => {
            if (callback) {
                callback(response);
            }
        };
        const options = {
            url,
            method: method || 'GET',
            headers: {
                Authorization: 'Bearer ' + store.state.token.trim()
            }
        };
        cy.request(options)
            .then(lCallback);
    });
}

export function getDatabase(endpoint: string, callback?: ICallback): void {
    apiRequest(`properties/${endpoint}`, callback);
}

export function readImageFileToString(fileName: string, alias: string): void {
    cy.readFile(fileName, 'base64').then((file: string) => {
        cy.log(`Length of image '${alias}': ${file.length}`);
    }).as(alias);
}

export function generateRandomName(prefix: string): string {
    return `${prefix}_${new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '')}`;
}
