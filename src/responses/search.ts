import express from "express";
import Config from "../config";
import DataSources from "../datasources";

export default (req:express.Request, res:express.Response, next:express.NextFunction, config:Config) => {
  const q = (config.get("queryParam") || {}).toString();
  const query = req.query[q];

  // DataSources load & filtering
  const dsListParam = (config.get("dataSourcesParam") || {}).toString();
  const dsList = req.query[dsListParam];
  const datasources = new DataSources(config, dsList);

  // 422 (Unprocessable Entity) Error if no query param
  if(!query) {
    res.status(422);
    return res.send({
      "status": "error",
      "message": `No search query '${q}' param set.`
    });
  }

  return datasources
    .search(query)
    .then((results) => {
      if(results instanceof Error) {
        res.status(500).send({
          status: "error",
          message: results.message,
          stack: results.stack
        });
      } else {
        res.send({
          data: results
        });
      }
    });
  };