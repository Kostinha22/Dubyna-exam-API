const { defineConfig } = require("cypress");

module.exports = defineConfig({
  watchForFileChanges: false, // вимикає автовідкриття тесту після зміни символів.
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
