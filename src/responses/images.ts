import express from "express";
import Config from "../config";
import { DEFAULT_COUNT, IResults } from "../datasources/adapter";
import DataSources from "../datasources";

export default (req:express.Request, res:express.Response, next:express.NextFunction, config:Config): object => {
  const reqOffset = parseInt(req.query.offset, 10);
  const reqCount = parseInt(req.query.count, 10) || DEFAULT_COUNT;

  // DataSources load & filtering
  const dsListParam = (config.get("dataSourcesParam") || {}).toString();
  const dsList = req.query[dsListParam];
  const datasources = new DataSources(config, dsList);

  return datasources
    .images(reqOffset, reqCount)
    .then((results:IResults) => {
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