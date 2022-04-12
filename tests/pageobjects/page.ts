export default class Page {

    static async open(page: any) {
        await browser.maximizeWindow();
        return browser.url(page);

    }
}
