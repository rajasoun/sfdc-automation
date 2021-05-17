#!/usr/bin/env node

var jsforce = require("jsforce");
var dotenv = require("dotenv").config();

var loginUrl = process.env.LOGIN_URL;
var username = process.env.USERNAME;
var password = process.env.PASSWORD;
var token = process.env.SECURITY_TOKEN;

var conn = new jsforce.Connection({
  // you can change loginUrl to connect to sandbox or prerelease env.
  loginUrl: loginUrl,
  logLevel: process.env.DEBUG,
});

async function closeGracefully(signal) {
  await fastify.close();
  process.exit();
}
process.on("SIGINT", closeGracefully);

conn.login(username, password + token, function (err, userInfo) {
  if (err) {
    return console.error(err);
  }
  // Now you can get the access token and instance URL information.
  // Save them to establish connection next time.
  console.log("Instance URL: " + conn.instanceUrl);
  console.log("Access Token: " + conn.accessToken);
  // logged in user property
  console.log("User ID: " + userInfo.id);
  console.log("Org ID: " + userInfo.organizationId);
});
