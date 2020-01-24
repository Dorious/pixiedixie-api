import express, { Response, Request } from "express";
import { config } from "../app";

const getExample = (req: Request, uri: string): string => {
  const apiPrefix = config.get("apiPrefix") || "/";
  return `${req.protocol}://${req.get('host')}${apiPrefix}${uri}`;
};

export interface IDocumentation {
  overview: string;
  handlers: {
    [propName: string]: {
      [propName: string]: {
        usage: string;
        example: string; 
      };
    };
  };
}

export interface IResponse {
  documentation: IDocumentation;
}

/**
 * Don't have time but we could make it autogenerate the doc
 */
export default (req: Request, res: Response): object => {
    
  const doc: IDocumentation = {
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

  const documentation = Object.assign({}, doc);

  return res.send(
    {documentation}
  );
};