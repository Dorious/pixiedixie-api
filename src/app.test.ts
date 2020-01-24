import app, { config } from "./app";
import axios from "axios";
import moxios from "moxios";
import express from "express";
import assert from "assert";
import Config, { IDataSource } from "../src/config";
import request from "supertest";
import { IDocumentation } from "./responses/documentation";
import giphyJson from "./__mocks__/giphy.json";
import pixabayJson from  "./__mocks__/pixabay.json";

const expressApp = express();
const apiPrefix = config.get("apiPrefix") || "/";
const queryParam = config.get("queryParam") || "/";

interface IMocks {
  [propName: string]: any;
}

describe("Application", () => {
  it("Should be Express instance", () => {
    assert.ok(typeof app === "function");
    assert.ok(typeof app.get === "function" && app.get === expressApp.get);
    assert.ok(typeof app.listen === "function" && app.listen === expressApp.listen);
  });

  it("Should export Config instance", () => {
    assert.ok(config instanceof Config);
  });

  it("Main page shows doc and have proper shape", async () => {
    const result = await request(app).get(apiPrefix);
    const body: IDocumentation = result.body;
    assert.ok(body);
  });

  it("Should show datasources info", async () => {
    const result = await request(app).get(`${apiPrefix}/datasources`);
    assert.ok(JSON.stringify(result.body.data) === JSON.stringify(config.get("dataSources")));
  });

  describe("Outside API calls", () => {

    beforeEach(() => {
      const datasources = config.get("dataSources");
      const mocks: IMocks = {
        pixabay: JSON.stringify(pixabayJson),
        giphy: JSON.stringify(giphyJson)
      };
      
      moxios.install();

      Object.keys(datasources).forEach((name: string) => {
        const ds: IDataSource = datasources[name];

        moxios.stubRequest(new RegExp(`^${ds.baseUrl}`), {
          status: 200,
          responseText: mocks[name]
        });
      });
      
    })

    afterEach(() => {
      moxios.uninstall();
    })

    it("Should show treding images", async () => {
      const result = await request(app).get(`${apiPrefix}/images`);
      assert.ok(true);
    });
  
    it("It should return 422 when no query param", async () => {
      const result = await request(app).get(`${apiPrefix}/search`);
      assert.equal(result.status, 422);
    });
  
    it("It should return total count of 8346 and 50 results by default", async () => {
      const result = await request(app).get(`${apiPrefix}/search?q=microsoft`);
      assert.equal(result.body.totalCount, 8346);
      assert.equal(result.body.count, 50)
    });
  });

  
});