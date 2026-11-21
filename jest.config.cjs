const { createDefaultEsmPreset } = require("ts-jest");

module.exports = {
  ...createDefaultEsmPreset(),
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/jest/**/*.jest.test.ts"],
};
