import express from "express";
import Config from "../config";

export default (req:express.Request, res:express.Response, next:express.NextFunction, config:Config): object => {
  return res.send({
    data: config.get("dataSources")
  });
};