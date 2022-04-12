import { waitAndType } from "../helpers/Generic";

const mapPageElement = {
  searchMap: '#searchboxinput',
  searchGrid: "//div[contains(@class,'Buc')]",
  searchList: "//span[contains(@class,'svc')]",
  todo: '//android.widget.FrameLayout[contains(@resource-id, "todo")]',
  inventory: '~Inventory',
  settings: '~Settings'
};

class MapPage {
  async searchLocation(query){
    await waitAndType(mapPageElement.searchMap,query);

  }
  async verifySearchGrid(query){

    const searchGridELem =await $(mapPageElement.searchGrid);
     const searchQuery = await $$(mapPageElement.searchList).length;
    await searchGridELem.waitForExist();

    for (let index = 1; index<=searchQuery;index++){
      const searchQueryText = await $("(//span[contains(@class,'svc')])["+index+"]").getText();
      await expect(searchQueryText.toLowerCase()).toEqual(query.toLowerCase());

    }



  }




}
export default new MapPage();
