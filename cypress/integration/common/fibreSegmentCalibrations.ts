// eslint-disable-next-line
/// <reference path="../../support/index.d.ts" />
import { And, When } from 'cypress-cucumber-preprocessor/steps';
import { World } from '../../support/world';
import { IFibreSegmentCalibration } from '../../support/types';

When('we add fibre segment calibrations', (context: any) => {
    World.cache = { fibreSegmentInstance: 0 };

    const fibreSegmentCalibrations: IFibreSegmentCalibration[] = context.hashes();

    for (const fibreSegmentCalibration of fibreSegmentCalibrations) {
        cy.get('[name="data_capture"]')
            .closest('[class^=title_]')
            .find('.repeated_group')
            .find('[class^=add_]')
            .click({ force: true })
            .closest('.entries')
            .find('[class^=list]')
            .focus();

        World.cache.fibreSegmentInstance ++;

        cy.addFibreSegmentCalibration(
            fibreSegmentCalibration.channel,
            fibreSegmentCalibration.monitorStart,
            fibreSegmentCalibration.monitorEnd,
            fibreSegmentCalibration.cableStart,
            World.cache.fibreSegmentInstance
        );
    }

});

And('we enable fibre segment calibrations', () => {
    cy.clickToggleField('acquisition.segmentCalibration.enabled');
});
