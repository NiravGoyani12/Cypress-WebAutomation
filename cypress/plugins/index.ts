import * as cucumberPreprocessor from 'cypress-cucumber-preprocessor';
import * as browserify from '@cypress/browserify-preprocessor';
import * as logToOutput from 'cypress-log-to-output';
const cucumber: any = cucumberPreprocessor.default;

export interface IEventCallback {
    (event: string, callback: any): void;
}

export default (on: IEventCallback): void => {
    const options = browserify.defaultOptions;

    options.browserifyOptions.outfile = 'build';
    options.browserifyOptions.debug = true;
    console.log(options);

    options.browserifyOptions.plugin.unshift(['tsify']);
    // Or, if you need a custom tsconfig.json for your test files:
    // options.browserifyOptions.plugin.unshift(['tsify', {project: 'path/to/other/tsconfig.json'}]);

    logToOutput.install(on);

    on('file:preprocessor', cucumber.default(options));
};
