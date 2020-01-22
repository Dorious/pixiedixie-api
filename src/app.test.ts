import app, { config } from "./app";
import express from "express";
import assert from "assert";
import Config from "../src/config";

const expressApp = express();

describe("Application", () => {
  it("Should be Express instance", () => {
    assert.ok(typeof app === "function");
    assert.ok(typeof app.get === "function" && app.get === expressApp.get);
    assert.ok(typeof app.listen === "function" && app.listen === expressApp.listen);
  });

  it("Should export Config instance", () => {
    assert.ok(config instanceof Config);
  })
});