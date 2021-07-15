// eslint-disable-next-line
/// <reference path='../../support/index.d.ts' />
import { Given, Then, And, When } from 'cypress-cucumber-preprocessor/steps';
import Color from 'color';
import { fieldHasError, findAndOpenDialog, propertyName } from '../../support/utils';
import { World, ICachedValues } from '../../support/world';
import {  PropertyState, FieldType, IDialogProperty, IDialogPropertyState, IDialogButtonState } from '../../support/types';

Then('the {string} component {string} visible', (component, assertion) => {
    const test = assertion === 'is' ? 'exist' : 'not.exist';
    cy.get(`#${component}`).should(test);
});

Then('we click on the {string} button', (id) => {
    cy.getButton(id).click();
});

Given('we click the {string} status bar button', (id) => {
    cy.clickStatusBarButton(id);
});

Then('the {string} fly-out appears', (id) => {
    cy.flyoutVisible(id);
});

Then('the {string} fly-out disappears', (id) => {
    cy.flyoutNotVisible(id);
});

Given('we click the {string} service toggle', (id) => {
    cy.clickServiceToggle(id.toLowerCase());
});

Then('a modal popup entitled {string} appears', (title) => {
    cy.modalPopupShouldAppear(title);
});

Given('we click the {string} button on the modal popup', (id) => {
    cy.getModalPopupButton(id).click();
});

Then('we enter {string} in the {string} dialog field', (value, field) => {
    cy.getInputField(field)
        .clear({ force: true })
        .type(value, { force: true })
        .blur();
});

Then('we enter {string} in the {string} field', (value, field) => {
    cy.get(`#${field}`)
        .focus()
        .clear({ force: true })
        .type(value, { force: true });
});

Then('the {string} field should turn {string}', (field, colour) => {
    cy.getInputField(field)
        .closest('.value')
        .should('have.css', 'color', Color(colour).string());
});

Given('the {string} dialog button is {string}', (id: string, state: string) => {
    const assertion = `be.${state}`;
    cy.getDialogButton(`dialog${id}`).should(assertion);
});

Given('we click on the {string} dialog button', (id) => {
    cy.getDialogButton(`dialog${id}`)
        .should('be.enabled')
        .click({ force: true });
});

Then('the apply completes', () => {
    cy.getPanelInFocus()
        .find('#panelBusy').should('not.be.visible');
});
 
Given('we cache the current value of field {string}', (field) => {
    cy.getInputField(field)
        .invoke('val')
        .then((text) => {
            const cachedValues: ICachedValues = {};
            cachedValues[field] = text; 
            World.cache = { cachedValues };
        });
});

Then('the {string} field contains the cached value', (field) => {
    cy.getInputField(field).should('have.value', World.cache.cachedValues[field]);
});

And('we wait for {int} milliseconds', (ms: number) => {
    cy.wait(ms);
});

When(
    'we set the {string} to {string} and {string} to {string}',
    (
        startField: string,
        startValue: string,
        endField: string,
        endValue: string
    ) => {
        cy.getInputField(startField)
            .clear({ force: true })
            .type(startValue, { force: true })
            .blur();

        cy.getInputField(endField)
            .clear({ force: true })
            .type(endValue, { force: true })
            .blur();
    }
);

Then(
    'an error message {string} be present for {string} {string} {string}',
    async (
        assertion: string,
        startField: string,
        andor: string,
        endField: string
    ) => {
        const timeout = assertion === 'should' ? 2000 : 1000;
        const startHasError = await fieldHasError(startField, timeout);
        const endHasError = await fieldHasError(endField, timeout);
        let error = false;
        if (andor === 'or') {
            error = startHasError || endHasError;
        } else {
            error = startHasError && endHasError;
        }
        expect(error).to.be.equal(assertion === 'should');
    }
);

Then(
    'an error message {string} be present for the {string} property type containing {string}',
    async (assertion: string, propertyType: string, containing: string) => {
        const errors = cy
            .get(`[data-property='${propertyName(containing)}']`)
            .closest(`[data-property-type=${propertyType}]`)
            .find('[class^=errors_]');
        if (assertion === 'should') {
            errors.its('length').should('be.gt', 0);
        } else {
            errors.its('length').should('eq', 0);
        }
    }
);

Then('we reset the dialog', async () => {
    cy.resetDialog();
});

Then('the {string} field is visible', (field: string) => {
    cy.getInputField(field).should('be.visible');
});

Then('the dialog buttons should be in the correct state', (context: any) => {
    context.hashes().forEach((line: IDialogButtonState) => {
        const assertion = `be.${line.state}`;
        cy.getDialogButton(`dialog${line.button}`).should(assertion);   
    } ); 
});

Given('the fields should be in the correct state', (context: any) => {
    let lastDialog = '';
    context.hashes().forEach((line: IDialogPropertyState) => {
        
        cy.log(`${line.state} '${line.name}'`);
        if (line.dialog !== lastDialog) {
            findAndOpenDialog(cy.getPanelInFocus(), line.dialog);
            lastDialog = line.dialog;
        }
        
        const controlType: FieldType = line.type.toLowerCase() as FieldType;
        let assertion = '';
        switch (controlType) {
            case FieldType.Toggle:
                assertion = line.state === PropertyState.Enabled ? 'match' : 'not.match';

                cy.getToggleField(propertyName(line.name))
                    .find('[class^=container_]')
                    .should('have.attr', 'class')
                    .and(assertion, /clickable_/);
                break;
            case FieldType.Dropdown:
                cy.getSelectField(propertyName(line.name))
                    .should(`be.${line.state}`);
                break;
            case FieldType.Textbox:
                assertion = line.state === PropertyState.Disabled ? 'have.attr' : 'not.have.attr';

                cy.getInputField(propertyName(line.name))
                    .should(assertion, PropertyState.ReadOnly);
                break;
            default:
                throw new Error(`Unknown type of control: ${controlType}`);
        }
    });
});

And('we refresh the page', () => {
    cy.reload();
    cy.waitUntilUILoaded();
});

When('we enter these values in the fields and cache the values', (context: any) => {
    let lastDialog = '';
    context.hashes().forEach((line: IDialogProperty) => { 

        cy.log(`${line.value} '${line.name}'`);

        if (line.dialog !== lastDialog) {
            findAndOpenDialog(cy.getPanelInFocus(), line.dialog);
            lastDialog = line.dialog;
        }

        const controlType: FieldType = line.type.toLowerCase() as FieldType;
        switch (controlType) {
            case FieldType.Toggle:
                cy.getToggleField(propertyName(line.name))
                    .find('[class^=container_]') 
                    .invoke('attr', 'class')
                    .then((myClass: string) => {
                        const isOn = myClass.includes('on_');
                        const needsToBeOn = (line.value === 'on');
                        if (isOn !== needsToBeOn) {
                            cy.clickToggleField(propertyName(line.name));
                        } else {
                            cy.log(`Toggle ${line.name} is already in the required state`);
                        }
                    });   
                break;
            case FieldType.Dropdown:
                cy.getSelectField(propertyName(line.name))
                    .select(line.value, { force: true })
                    .blur();
                break;
            case FieldType.Textbox:
                cy.getInputField(propertyName(line.name))
                    .clear({ force: true })
                    .type(line.value, { force: true })
                    .blur();
                break;
            default:
                throw new Error(`Unknown type of control: ${controlType}`);
        }

    });    
   
    World.cache = { cachedContext: context };  
});

Then('the fields should contain the cached values', (context: any) => {
    let lastDialog = '';
    const contextToUse = context || World.cache.cachedContext;
    contextToUse.hashes().forEach((line: IDialogProperty) => { 

        cy.log(`${line.name} '${line.value}'`);
        if (line.dialog !== lastDialog) {
            findAndOpenDialog(cy.getPanelInFocus(), line.dialog);
            lastDialog = line.dialog;
        }
        const controlType: FieldType = line.type.toLowerCase() as FieldType;
        let assertion = '';
        switch (controlType) {
            case FieldType.Toggle:
                assertion = (line.value === 'on') ? 'match' : 'not.match';
                cy.getToggleField(propertyName(line.name))
                    .find('[class^=container_]')
                    .should('have.attr', 'class')
                    .and(assertion, /on_/);
                break;
            case FieldType.Dropdown:
            case FieldType.Textbox:
                cy.getInputField(propertyName(line.name)).should('have.value', line.value);
                break;
            default:
                throw new Error(`Unknown type of control: ${controlType}`);
        }
    });    
});

Then('we select {string} dropdown in the {string} field', (value, field) => {
    cy.getInputField(propertyName(field))
        .parent()
        .find('[class^=units_] select')
        .select(value, { force: true })
        .blur();  
});

Then('we expect the units to be {string} in the {string} field', (value, field) => {
    cy.getInputField(propertyName(field))
        .parent()
        .find('[class^=units_] select')
        .find('option:selected').should('have.text', value);
});

Then('we expect the filled value to be {string} in the {string} dialog field', (value, field) => {
    cy.getInputField(propertyName(field)).should('have.value', value);  
});

Then('the {string} field should contains {string}', (field: string, unit: string) => {
    cy.getInputField(propertyName(field))
        .parent()
        .find('[class^=units_]')
        .invoke('text')
        .then((text) => {
            expect(text.trim()).to.eq(unit);
        });          
});
