import express from "express";
import Config from "./config";

const app = express();
export const config = new Config();

const getHandler = (resource:string) => (req:express.Request, res:express.Response) => {
  import(`./responses/${resource}`)
    .then(callback => {
      callback.default(req, res, config);
    });
}

// Let's use root as API Documentation.
app.get("/", getHandler("documentation"));

// Get all datasources info.
app.get("/datasources", getHandler("datasources"));

// Get some images for main page.
app.get("/images", getHandler("images"));

// Search for images.
app.get("/search", getHandler("search"));

export default app;