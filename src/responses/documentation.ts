import express from "express";

const response = {
  overview: "Basic calls for Pixie & Dixie GIFs",
  handlers: {
    "/datasources": { },
    "/images": { },
    "/search": { }
  }
}

export default (req: express.Request, res: express.Response): object => {
  const documentation = Object.assign({}, response);

  return res.send(
    {documentation}
  );
};