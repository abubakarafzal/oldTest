Feature: Dummy API Testing

  Scenario Outline: Verify the employee

    Given I get the employees
    Then I verify the"<employeeName>" salary

    Examples:
      | employeeName |  |  |
      | TestEmployee |  |  |

