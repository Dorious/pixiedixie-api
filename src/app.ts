import express from "express";
import Config from "./config";

const app = express();
export const myRouter = express.Router();
export const config = new Config();
const apiPrefix = config.get("apiPrefix") || '/';

export const getHandler = (resource: string) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  import(`./responses/${resource}`)
    .then(callback => {
      callback.default(req, res, next, config);
    });
}

// Let's use root as API Documentation.
myRouter.get("/", getHandler("documentation"));

// Get all datasources info.
myRouter.get("/datasources", getHandler("datasources"));

// Get some images for main page.
myRouter.get("/images", getHandler("images"));

// Search for images.
myRouter.get("/search", getHandler("search"));

// Setup api prefix
console.log(`Setting up "${apiPrefix}" API prefix...`);
app.use(apiPrefix, myRouter);

export default app;