const {
  openBrowser,
  goto,
  write,
  click,
  link,
  openTab,
  getCookies,
  closeBrowser,
} = require("taiko");

const prompt = require("prompt-sync")({ sigint: true });
require("dotenv").config();

(async () => {
  try {
    await openBrowser();
    await goto(process.env.SFDC_URL);
    await write(process.env.USERNAME, into(textBox({ id: "username" })));
    await write(process.env.PASSWORD, into(textBox({ id: "password" })));
    await click("Log In");

    const otp = prompt("OTP: ");
    await write(otp, into(textBox({ id: "smc" })));
    await click("Verify");

    console.log(await getCookies());
  } catch (error) {
    console.error(error);
  } finally {
    await closeBrowser();
  }
})();
