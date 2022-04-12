Feature: Google Maps

  Scenario Outline: As a user, i can search for the location and validate the searched <location> location

    Given I am on the maps page
    When I enter the <location> in the search bar
    Then I should see a list of <location> in search grid

    Examples:
      | location |  |  |
      | dublin   |  |  |

