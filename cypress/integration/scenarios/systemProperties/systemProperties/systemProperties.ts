import { When, Then } from 'cypress-cucumber-preprocessor/steps';
import SystemPropertiesPanel from '../../../panels/systemPropertiesPanel';

const identitySection = new SystemPropertiesPanel.Identity();

When('we click on the UUID generate button', () => {
    identitySection.generateUuid();
});

Then('the a valid UUID should be generated', () => {
    identitySection.UUID.invoke('val').as('uuid1');
    cy.get('@uuid1').then(uuid => {
        expect(uuid).not.undefined.and.not.null;
        expect(identitySection.isUuidFormatValid(String(uuid)), 'is format valid?').true;
    });
});

Then('the UUID should change', () => {
    identitySection.UUID.invoke('val').then(uuid2 => {
        cy.get('@uuid1').then(uuid1 => {
            expect(uuid1).not.eq(uuid2);
        });
    });
});
