import app from "./app";
import express from "express";
import assert from "assert";

const expressApp = express();

describe("Application", () => {
  it("Should be Express instance", () => {
    assert.ok(typeof app === "function");
    assert.ok(typeof app.get === "function" && app.get === expressApp.get);
    assert.ok(typeof app.listen === "function" && app.listen === expressApp.listen);
  });
});