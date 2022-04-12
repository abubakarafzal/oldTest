const axios = require('axios');
require('dotenv').config();
let uri;
const yaml = require('js-yaml');
const fs = require('fs');
let employeeData = yaml.load(fs.readFileSync('tests/data/Yaml/employee.yml', 'utf8'));
let responseData;
import { getValue, setValue } from '@wdio/shared-store-service';

class testApi {
  async getEmployee(endpoint) {
    try {
      uri = 'http://dummy.restapiexample.com/api/v1/' + endpoint;

      const response = await axios.get(uri);
      responseData = response.data.data;
      console.log(responseData);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  async verifyEmployeeSalary(employee){
    const employeeName = employeeData[employee]['employee-name'];
    const employeeExpectedSalary = employeeData[employee]['salary'];

    // @ts-ignore
    const employeeObject = responseData.filter(obj => employeeName.includes(obj.employee_name));
    console.log(employeeObject[0]['employee_salary']);
    const employeActualSalary = employeeObject[0]['employee_salary'];
    await expect(employeeExpectedSalary).toEqual(employeActualSalary);

  }
}
export default new testApi();

