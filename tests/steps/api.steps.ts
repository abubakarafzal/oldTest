import testApi from "../helpers/testApi";

const { Given, Then } = require('@cucumber/cucumber');
Given(/^I get the (\w+)$/,async function(endpoint) {
await testApi.getEmployee(endpoint);
});
Then(/^I verify the"([^"]*)" salary$/,async function(employee) {
await testApi.verifyEmployeeSalary(employee);
});
