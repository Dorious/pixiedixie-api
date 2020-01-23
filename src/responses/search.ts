import express from "express";
import Config from "../config";
import DataSources from "../datasources";
import { IResults, DEFAULT_COUNT } from "../datasources/adapter";

export default (req: express.Request, res: express.Response, next: express.NextFunction, config: Config) => {
  const q = (config.get("queryParam") || {}).toString();
  const query = req.query[q];
  const reqOffset = parseInt(req.query.offset, 10);
  const reqCount = parseInt(req.query.count, 10) || DEFAULT_COUNT;

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
    .search(query, reqOffset, reqCount)
    .then((results: IResults) => {
      const { error, totalCount, offset, count, images } = results;

      if(error instanceof Error) {
        res.status(500).send({
          status: "error",
          message: error.message,
          stack: error.stack
        });
      } else {
        res.send({
          status: "success",
          totalCount,
          offset,
          count,
          data: images
        });
      }
    });
  };