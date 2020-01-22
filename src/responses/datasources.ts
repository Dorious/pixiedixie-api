import express from "express";
import Config from "../config";

export default (req : express.Request, res : express.Response, config : Config): object => {
  return res.send({
    data: config.getConfig("dataSources")
  });
};