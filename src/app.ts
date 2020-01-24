import express from "express";
import Config from "./config";
import {AxiosError} from "axios";

const app = express();
export const myRouter = express.Router();
export const config = new Config();
const apiPrefix = config.get("apiPrefix") || '/';

export const getHandler = (resource: string) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  import(`./responses/${resource}`)
    .then(callback => {
      const p = callback.default(req, res, next, config);
      
      if(typeof(p.catch) === "function") 
        p.catch((err:AxiosError|string) => {
          if(typeof(err) === "string") {
            return res.status(400).send({
              status: "error",
              message: err,
            });
          } else {
            let status = err.response ? err.response.status : 500;
            return res.status(status).send({
              status: "error",
              message: err.message,
              stack: err.stack
            });
          }
        });
      
      return p;
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