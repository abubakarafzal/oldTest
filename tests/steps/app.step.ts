import Page from "../pageobjects/page";
import MapPage from "../pageobjects/MapPage";

const { Given, When, Then } = require('@cucumber/cucumber');
require('dotenv').config();
let url;

Given(/^I am on the (\w+) page$/, async (page) => {
  url = process.env.URL+page;
  await Page.open(url);
  const title = await browser.getTitle();
  await expect(title.toLowerCase()).toContain(page);

});

When(/^I login with (\w+) and (.+)$/, async (username, password) => {
  await $('#username').setValue(username);
  await $('#password').setValue(password);
  await $('button[type="submit"]').click();
});

Then(/^I should see a flash message saying (.*)$/, async (message) => {
  await expect($('#flash')).toBeExisting();
  await expect($('#flash')).toHaveTextContaining(message);
});




When(/^I enter the (.*) in the search bar$/, async function(query) {
  await MapPage.searchLocation(query);
});
Then(/^I should see a list of (.*) in search grid$/,async function(query) {
await MapPage.verifySearchGrid(query);
});
