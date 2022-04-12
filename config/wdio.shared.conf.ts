import * as fs from 'fs';

// @ts-ignore
import cucumberJson from 'wdio-cucumberjs-json-reporter';
const { generate } = require('multiple-cucumber-html-reporter');

const reporter = require('cucumber-html-reporter');
const { addArgument } = require('@wdio/allure-reporter').default;
const video = require('wdio-video-reporter');
let scenarioCounter = 0;
const debug = !!process.env.DEBUG;
const stepTimout = debug ? 24 * 60 * 60 * 1000 : 60000;
const argv = require('yargs').argv;
const wdioParallel = require('wdio-cucumber-parallel-execution');
const { removeSync } = require('fs-extra');

const currentTime = new Date().toJSON().replace(/:/g, '-');
const sourceSpecDirectory = `tests/features/featureFiles`;
const jsonTmpDirectory = `test-report/cucumber/`;

let featureFilePath = `${sourceSpecDirectory}/*.feature`;

// If parallel execution is set to true, then create the Split the feature files
// And store then in a tmp spec directory (created inside `the source spec directory)
if (argv.parallel === 'true') {
  const tmpSpecDirectory = `${sourceSpecDirectory}/tmp`;
  wdioParallel.performSetup({
    sourceSpecDirectory: sourceSpecDirectory,
    tmpSpecDirectory: tmpSpecDirectory,
    cleanTmpSpecDirectory: true
  });
  featureFilePath = `${tmpSpecDirectory}/*.feature`;
}

export const config: WebdriverIO.Config = {
  /**
   * NOTE: This is just a place holder and will be overwritten by each specific configuration
   */
  specs: ['./tests/features/**/*.feature'],

  exclude: [
  ],

  /**
   * NOTE: This is just a place holder and will be overwritten by each specific configuration
   */
  capabilities: [
    {

      maxInstances: 1,
      //
      browserName: 'chrome',
      acceptInsecureCerts: true,

    },],
  logLevel: 'debug',

  bail: 0,

  baseUrl: 'http://the-internet.herokuapp.com',

  waitforTimeout: 35000,

  connectionRetryTimeout: 120000,
  // Default request retries count
  connectionRetryCount: 3,

  framework: 'cucumber',
  services: ['chromedriver','shared-store'],

  outputDir: './test-report/output',
  reporters: [
    'spec',

    [
      'cucumberjs-json',
      {
        jsonFolder: './test-report/cucumber',
        language: 'en'
      }
    ],

    [
      video,
      {
        saveAllVideos: false,
        videoSlowdownMultiplier: 5
      }
    ],
    [
      'allure',
      {
        outputDir: './test-report/allure-result/',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
        useCucumberStepReporter: true
      }
    ],

  ],

  // Options to be passed to Mocha.
  cucumberOpts: {
    require: ['./tests/steps/*.ts'],
    backtrace: false,
    requireModule: [],
    dryRun: false,
    failFast: false,
    format: ['pretty'],
    snippets: true,
    source: true,
    profile: [],
    strict: false,
    tagExpression: 'not @skip',
    timeout: stepTimout,

    retry: 0,
    // <boolean> Enable this config to treat undefined definitions as warnings.
    ignoreUndefinedDefinitions: false
  },

  before: async function () {
  },



  // @ts-ignore
  beforeScenario: async function (world, result, scenario) {

  },

  // @ts-ignore
  afterScenario: async function (
    uri,
    feature,
    { error, result, duration, passed },
    sourceLocation
  ) {
    console.log('After scenario');

    scenarioCounter += 1;
    addArgument('Scenario #', scenarioCounter);
    if (error) {

     try{
       cucumberJson.attach(error, 'application/json');
       cucumberJson.attach(await driver.takeScreenshot(), 'image/png');
      } catch (e) {
        console.log(e);
      }
    } else {
      cucumberJson.attach(await driver.takeScreenshot(), 'image/png');
    }
  },

  // @ts-ignore
  afterStep: async function (
    uri: undefined,
    feature: undefined,
    scenario: { error: boolean }
  ) {
    if (scenario.error) {
       driver.takeScreenshot();

    }
  },
  // @ts-ignore
  afterFeature: async function () {
  },

  onPrepare: async () => {
    // Remove the `tmp/` folder that holds the json report files
    await removeSync(jsonTmpDirectory);
    if (!fs.existsSync(jsonTmpDirectory)) {
      fs.mkdirSync(jsonTmpDirectory);
    }
  },

  onComplete: async () => {
    //   // await closeApplication();
    try {
      const consolidatedJsonArray = wdioParallel.getConsolidatedData({
        parallelExecutionReportDirectory: jsonTmpDirectory
      });

      const jsonFile = `${jsonTmpDirectory}report.json`;
      await fs.writeFileSync(jsonFile, JSON.stringify(consolidatedJsonArray));

      const options = {
        theme: 'bootstrap',
        jsonFile: jsonFile,
        output: `test-report/html/report.html`,
        brandTitle: 'Alerzo Admin APP',
        reportSuiteAsScenarios: true,
        scenarioTimestamp: true,
        launchReport: false,
        ignoreBadJsonFile: true
      };

      reporter.generate(options);
    } catch (err) {
      console.log('err', err);
      throw err;
    }

  }

};
