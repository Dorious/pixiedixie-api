import express, { Response, Request } from "express";
import { config } from "../app";

const getExample = (req: Request, uri: string): string => {
  const apiPrefix = config.get("apiPrefix") || "/";
  return `${req.protocol}://${req.get('host')}${apiPrefix}${uri}`;
};

/**
 * Don't have time but we could make it autogenerate the doc
 */
export default (req: Request, res: Response): object => {
    
  const response = {
    overview: "Basic calls for Pixie & Dixie GIFs",
    handlers: {
      "/datasources": { 
        "GET": {
          "usage": "Shows information about datasources",
          "example": getExample(req, "/datasources")
        }
      },
      "/images": { 
        "GET": {
          "usage": "Get trending images",
          "example": getExample(req, "/images?offset=0&count=25&datasources[]=pixabay&datasources[]=giphy")
        }
      },
      "/search": { 
        "GET": {
          "usage": "Search for images",
          "example": getExample(req, "/search?q=YOURQUERY&offset=0&count=25&datasources[]=pixabay&datasources[]=giphy")
        }
      }
    }
  };

  const documentation = Object.assign({}, response);



  return res.send(
    {documentation}
  );
};