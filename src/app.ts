import express from "express";
import Config from "./config";

const app = express();
const router = express.Router();
export const config = new Config();
const apiPrefix = config.get("apiPrefix") || '/';

const getHandler = (resource:string) => (req:express.Request, res:express.Response, next:express.NextFunction) => {
  import(`./responses/${resource}`)
    .then(callback => {
      callback.default(req, res, next, config);
    });
}

// Let's use root as API Documentation.
router.get("/", getHandler("documentation"));

// Get all datasources info.
router.get("/datasources", getHandler("datasources"));

// Get some images for main page.
router.get("/images", getHandler("images"));

// Search for images.
router.get("/search", getHandler("search"));

// Setup api prefix
console.log(`Setting up "${apiPrefix}" API prefix...`);
app.use(apiPrefix.toString(), router);

export default app;