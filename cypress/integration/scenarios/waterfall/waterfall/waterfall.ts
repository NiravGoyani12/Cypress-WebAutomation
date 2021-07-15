// eslint-disable-next-line
/// <reference path="../../../../support/index.d.ts" />
import { Then, And } from 'cypress-cucumber-preprocessor/steps';
import { readImageFileToString, generateRandomName } from '../../../../support/utils';

And('FDEL is processing in {string} mode', (mode) => {
    cy.selectFdelDisplayMode(mode);
});

And('we click the {string} button in FDEL toolbar', (buttonName: string) => {
    cy.clickButtonInFdelToolbar(buttonName);
});

Then('the waterfall {string} progress', (assertion: string) => {
    let path1 = '';
    let path2 = '';
    // Force the soundfield separator to be in a place useful for a screenshot
    let clip = { x: 200, y: 300, width: 50, height: 300 };
    cy.window().its('fibreGraphCanvas')
        .then((fibreGraphCanvas) => {
            if (fibreGraphCanvas.orientation === 'horizontal') {
                fibreGraphCanvas.children.soundfield_separator.y = 70;
                fibreGraphCanvas.children.soundfield_separator.y = 300;
            } else {
                fibreGraphCanvas.children.soundfield_separator.x = 500;
                fibreGraphCanvas.children.soundfield_separator.y = 0;
                clip = { x: 70, y: 400, width: 400, height: 50 };
            }
            // Let the soundfield resize
            cy.wait(2000);
            // Screenshot it
            cy.get('#waterfall_canvas').as('waterfall')
                .screenshot(generateRandomName('temp'), { clip,
                    onAfterScreenshot(_$el, props) {
                        path1 = props.path;
                    }
                }).then(() => {
                    readImageFileToString(path1, 'file1');

                    cy.wait(2 * 1000); // Let the waterfall (hopefully) progress a bit

                    cy.get('@waterfall')
                        .screenshot(generateRandomName('temp'), { clip,
                            onAfterScreenshot(_$el, props) {
                                path2 = props.path;
                            }
                        }).then(() => {
                            readImageFileToString(path2, 'file2');
                            // compare two screenshot files
                            cy.get('@file1').then(file1 => {
                                cy.get('@file2').then(file2 => {
                                    if (assertion === 'should') {
                                        expect(file1).not.be.eq(file2, 'File1 should not be equal to File2');
                                    } else {
                                        expect(file1).eq(file2, 'File1 should be equal to File2');
                                    }
                                });
                            });  
                        });
                });
        });
    
});

Then('the waterfall scale should be located according to the {string}', (orientation: string) => {
    
    // The 0 value on the Scale, in the Horizontal orientation, is located 200px from the left of the parent window 
    // In the Vertical orientation - further than 200px (could be greater than 1000px) from the left of the window 
    // We can use this to distinguish the current orientation of the waterfall graph
    
    cy.wait(2000); // let the waterfall graph to redraw

    cy.get('[name=scaleRangeLow]')
        .then($el => {
            const element = $el.get(0);
            const styles = window.getComputedStyle(element);
            const actLeftPositionOfScale = parseInt(styles.getPropertyValue('left'));
            const expLeftPositionOfScaleInHorizontal = 200;
     
            if (orientation === 'Horizontal') {
                expect(actLeftPositionOfScale).to.be.lte(expLeftPositionOfScaleInHorizontal);
            } else {
                expect(actLeftPositionOfScale).to.be.gt(expLeftPositionOfScaleInHorizontal);
            }
        });
});
