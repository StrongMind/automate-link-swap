/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const fs = require("fs");
const path = require('path');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  const data = fs.readFileSync(path.join(__dirname, 'data.tsv')).toString();
  config.env.inputData = data;
  
  const cookie = fs.readFileSync(path.join(__dirname, 'cookie.txt')).toString();
  config.env.cookie = cookie;

  return config;
}
