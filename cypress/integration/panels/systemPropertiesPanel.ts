export default class SystemPropertiesPanel {
    static Identity = class {
        get UUID(): Cypress.Chainable<Element> {
            return cy.getInputField('identification.helios.uuid');
        }

        isUuidFormatValid(uuid: string): boolean {
            const uuidString = uuid.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
            return uuidString !== null;
        }
        
        generateUuid(): void { 
            this.UUID.parent().find('button').click({ force: true });
        }
    };
}
