// eslint-disable-next-line
/// <reference path="../../support/index.d.ts" />

import { Given, Then, And } from 'cypress-cucumber-preprocessor/steps';
import { Store } from 'vuex';
import { World } from '../../support/world';
import { assertVisible, getStore } from '../../support/utils';

const checkPlaybackFileName = (playbackFile: string): void => {
    let first = '';
    let last = '';
    let count = 0;
    cy.get('#panel_dock_Playback')
        .find('[class^=switcher]')
        .find('[class^=sessionName]')
        .then(($el) => {
            const spans = $el[0].querySelectorAll('span');
            if (Object.keys(spans).length > 0) {
                for (const span of spans) {
                    count++;
                    if (count === 1) {
                        first = span.innerText;
                    } else {
                        last = span.innerText;
                    }
                }
                expect(playbackFile.substr(0, first.length)).to.equal(first);
                if (last.length) {
                    const l = playbackFile.length;
                    const sp = l - last.length;
                    expect(playbackFile.substr(sp)).to.equal(last);
                }
            } else {
                expect($el[0].innerText).to.be.equal(playbackFile);
            }
        });
};

Then('the {string} status says {string}', (id, status) => {
    cy.get(`#${id.toLowerCase()} [class^=subtitle]`)
        .should('have.text', status);
});

Then('the {string} status says one of {string} or {string}', (id, status1, status2) => {
    cy.get(`#${id.toLowerCase()} [class^=subtitle]`)
        .invoke('text')
        .then((text) => {
            expect(text).to.be.oneOf([status1, status2]);
        });
});

Then('we should be redirected to the simulator', () => {
    cy.location().should((loc) => {
        expect(loc.search).to.eq('?mode=playback');
    });
});

Then('we should be redirected to live', () => {
    cy.location().should((loc) => {
        expect(loc.search).to.eq('');
    });
});

And('We visit the simulator page', () => {
    cy.visit('/?mode=playback');
});

And('the playback file should be {string}', (playbackFile: string) => {
    checkPlaybackFileName(playbackFile);
});

And('the playback file should be the selected file', () => {
    checkPlaybackFileName(World.cache.playbackFile.split('/').pop());
});

And('all playback controller buttons should be disabled', () => {
    cy.get('[class^=playbackcontrols]')
        .find('button')
        .each(($el) => {
            cy.wrap($el).should('be.disabled');
        });
});

And('the {string} playback buttons {string} be enabled', (buttonStr: string, assertion: string) => {
    const buttons = buttonStr.split(',');
    const test = assertion === 'should' ? 'be.enabled' : 'not.be.enabled';
    buttons.forEach((button) => {

        cy.get(`#playback${button.trim()}`)
            .then($el => {
                const nested = $el[0].querySelector('button');
                if (nested) {
                    cy.wrap(nested, { timeout: 10000 }).should(test);
                } else {
                    cy.wrap($el, { timeout: 10000 }).should(test);
                }
            });
    });
});

And('the {string} playback buttons {string} be visible', (buttonStr: string, assertion: string) => {
    const buttons = buttonStr.split(',');
    const visible = assertion === 'should';
    buttons.forEach((button) => {
        // These buttons are rendered with a "v-if" so if they are not meant to be seen
        // the element will not actually exist at all. We therefore cannot use
        // a cypress command to determine its presence
        const query = `#playback${button.trim()}`;
        if (assertion === 'should not') {
            const btn = document.querySelector(query);
            expect(btn).to.be.null;
        } else {
            cy.get(query)
                .then($el => {
                    // Cypress is crap at working out if our buttons are really visible
                    // due to its analysis of the parent and our quirky CSS situation so...
                    const element = $el.get(0);
                    const nested = element.querySelector('button');
                    if (nested) {
                        assertVisible(nested, visible);
                    } else {
                        assertVisible(element, visible);
                    }
                });
        }
    });
});

Then('we click on the {string} playback button', (button: string) => {
    cy.get(`#playback${button.trim()}`)
        .click({ force: true });
});

And('we click on the file chooser button', () => {
    cy.get('#panel_dock_Playback')
        .find('[class^=switcher]')
        .find('button').click({ force: true });
    
});

Given('we select the first available {string} file in {string} containing {string}', (ext: string, path: string, filter: string) => {
    const traverseContents = (store: Store<any>, path: string, filter: string): string => {
        const files = store.state.simulator.files;
        let found = '';
        for (const file in files) {
            if (files[file] && file.indexOf(path) === 0) {
                const split = file.split('.');
                if (split.length > 1) {
                    if (split[split.length - 1] === ext && file.toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
                        found = file;
                        break;
                    }
                }
            }
        }
        return found;
    };
    const selectPlaybackFile = async (store: Store<any>, path: string, filter: string): Promise<string> => {
        await store.dispatch('simulator/list', path);
        const found = traverseContents(store, path, filter);
        expect(found).not.to.be.null;
        store.commit('simulator/chosen', store.state.simulator.files[found]);
        await store.dispatch('simulator/set');
        // Close the file chooser
        cy.getDialogButton('dialogcancel').click({ force: true });
        World.cache = { playbackFile: found };
        return found;
    }; 
    getStore().then({ timeout: 10000 }, async (store: Store<any>) => {
        await selectPlaybackFile(store, path, filter);
    });
});

And('the progress bar should be at {int}%', (progress: number) => {
    cy.getPlaybackProgressBar()
        .find('.v-progress-linear__determinate')
        .then(($el) => {
            const errorElement = $el.get(0);
            const styles = window.getComputedStyle(errorElement);
            const width = parseInt(styles.getPropertyValue('width'));
            // Cache the current width
            World.cache = { progressBarWidth: width };
            expect(width).to.equal(progress);
        });
});

And('the progress bar {string} have advanced', (assertion: string) => {
    cy.getPlaybackProgressBar()
        .find('.v-progress-linear__determinate')
        .then(($el) => {
            const errorElement = $el.get(0);
            const styles = window.getComputedStyle(errorElement);
            const width = parseInt(styles.getPropertyValue('width'));
            const previousWidth = World.cache.progressBarWidth;
            // Cache the current width
            World.cache = { progressBarWidth: width };
            if (assertion === 'should') {
                expect(width).to.be.gt(previousWidth);
            } else {
                expect(width).to.be.equal(previousWidth);
            }
        });
});

Given('we ensure {string} {string} running', (id: string, action: string) => {
    
    const requiredState = action === 'is' ? 'Running' : 'Not Running';

    cy.clickStatusBarButton('FDELControl'); // Open FDEL control
    
    // Change the state of Helios, if needed
    cy.get(`#${id.toLowerCase()} [class^=subtitle]`)
        .invoke('text')
        .then((actualState) => {
            if (actualState === requiredState) {
                
                // Helios already is in the state required, so no action is needed
                
            } else {
                
                // The current state of Helios differs from the required one
                // let's click on Helios toggle to change its status to the required one
                
                cy.clickServiceToggle(id.toLowerCase());

                cy.wait(5 * 1000); // Wait until (possibly) Helios switching

                cy.get(`#${id.toLowerCase()} [class^=subtitle]`)
                    .invoke('text')
                    .then((actualState) => {
                        expect(actualState).to.eq(requiredState);
                    });
            }
        });
    
    cy.clickStatusBarButton('FDELControl'); // Close FDEL control
});
