import { config } from './wdio.shared.conf';
config.capabilities = [
  {

    maxInstances: 3,
    browserName: 'chrome',
    acceptInsecureCerts: true,
    // We need to extends some Chrome flags in order to tell Chrome to run headless
    'goog:chromeOptions': {
      args: ['--headless', '--disable-gpu', '--disable-dev-shm-usage'],
    },
  },

];


exports.config = config;
