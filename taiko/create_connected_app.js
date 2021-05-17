const {
  openBrowser,
  goto,
  textBox,
  into,
  write,
  button,
  click,
  text,
  $,
  checkBox,
  to,
  attach,
  dropDown,
  closeBrowser,
} = require("taiko");

const prompt = require("prompt-sync")({ sigint: true });
require("dotenv").config();

const app_manager_locator = "//a/*[text()='App Manager']";
const new_connected_app_locator = "//*[text()='New Connected App']";
const connected_app_name_locator =
  "appsetup:setupForm:details:appsection:nameSection:name";
const contact_email_locator =
  "appsetup:setupForm:details:appsection:emailSection:contactEmail";
const connected_app_description_locator =
  "appsetup:setupForm:details:appsection:descriptionSection:description";
const oauth_checkbox_locator =
  "appsetup:setupForm:details:consumersection:oauth:isOauth";
const callback_url_locator =
  "appsetup:setupForm:details:consumersection:oauthSection:multiCallbackUrlSection:callbackUrl";
const cert_user_locator =
  "appsetup:setupForm:details:consumersection:oauthSection:digitalSignaturesSection:certUsedOption";
const cert_file_upload_locator =
  "//*[@id='appsetup:setupForm:details:consumersection:oauthSection:digitalSignaturesSection:certFileUpload']";
const api_list_locator =
  "appsetup:setupForm:details:consumersection:oauthSection:scopesSection:scopes:duelingListBox:backingList_a";
const api_locator = "(//*[@alt='Add'])[1]";

const data_api = "Access and manage your data (api)";
const refresh_token_api =
  "Perform requests on your behalf at any time (refresh_token, offline_access)";
const web_api = "Provide access to your data via the Web (web)";
const user_policy = "Admin approved users are pre-authorized";
const assign_connected_app_locator =
  "//a[normalize-space(text()) = 'Assigned Connected Apps']";
const connected_app_assignment_locator_drop_down =
  "page:console:j_id81:entity_access_detail:pageblock:j_id160:pages:duelingListBox:backingList_a";
const connected_app_add_locator = "(//*[@alt='Add'])[1]";

const callback_url = "http://localhost:1717/OauthRedirect";

(async () => {
  try {
    await openBrowser();

    await goto(
      process.env.SFDC_URL.concat("/lightning/setup/SetupOneHome/home")
    );
    await write(process.env.USERNAME, into(textBox({ id: "username" })));
    await write(process.env.PASSWORD, into(textBox({ id: "password" })));
    await click(button({ id: "Login" }));

    if (process.env.OTP == "Yes") {
      const otp = prompt("OTP: ");
      await write(otp, into(textBox({ id: "smc" })));
      await click("Verify");
      console.log(await getCookies());
    }

    await text("Home").exists();
    await write("App Manager", into(textBox({ placeholder: "Quick Find" })));
    await click("App Manager");
    await click($(app_manager_locator));
    await click($(new_connected_app_locator));

    await write(
      process.env.CONNECTED_APP_NAME,
      into(textBox({ id: connected_app_name_locator }))
    );
    await write(
      process.env.EMAIL,
      into(textBox({ id: contact_email_locator }))
    );
    await write(
      process.env.CONNECTED_APP_DESCRIPTION,
      into(textBox({ id: connected_app_description_locator }))
    );
    await checkBox({ id: oauth_checkbox_locator }).check();
    await write(callback_url, into(textBox({ name: callback_url_locator })));

    await checkBox({ id: cert_user_locator }).check();
    await attach(
      "certs/".concat(process.env.DOMAIN).concat(".crt"),
      to($(cert_file_upload_locator))
    );

    await dropDown({ name: api_list_locator }).select(data_api);
    await click($(api_locator));
    await dropDown({ name: api_list_locator }).select(refresh_token_api);
    await click($(api_locator));
    await dropDown({ name: api_list_locator }).select(web_api);
    await click($(api_locator));
    await click(button({ value: "Save" }));
    await click(button({ value: "Continue" }));

    // await click(button({ value: "Manage" }));
    // await waitFor("2000");
    // await click(button({ value: "Edit Policies" }));
    // await overridePermissions(process.env.SFDC_URL,['OK']);
    // await dropDown({ name: "userpolicy" }).select(user_policy);
    // confirm("/^Enabling this option", async () => await accept());
    // await click('OK')

    // await dropDown({ name: "userpolicy" }).select(user_policy);
    // confirm(async () => {
    //   console.log("ok");
    //   await accept();
    // });
    // await click(button("Press")); // actual confirm dialog is shown
    // await click(button({ title: "Save" }));

    await clear(textBox({ placeholder: "Quick Find" }));
    await write("Permission", into(textBox({ placeholder: "Quick Find" })));
    await click("Permission Sets");
    await waitFor(5000);
    await click("Dashboard Admin");
    await click($(assign_connected_app_locator));
    await click("Edit");
    await dropDown({ name: connected_app_assignment_locator_drop_down }).select(
      process.env.CONNECTED_APP_NAME
    );
    await click($(connected_app_add_locator));
    await click(button({ value: "Save" }));
  } catch (error) {
    console.error(error);
  } finally {
    await closeBrowser();
  }
})();
