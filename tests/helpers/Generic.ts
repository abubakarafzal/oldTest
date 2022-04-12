export async function waitAndType(selector, input) {
  const element: WebdriverIO.Element = await $(selector);
  try {
    await element.scrollIntoView();
    await element.waitForEnabled();
    await element.setValue(input);
  } catch (e) {
    console.log(
      `${selector} is not displayed With the Exception: ${e.message}`
    );
    return e;
  }
}
