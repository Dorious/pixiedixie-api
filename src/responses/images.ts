import express from "express";

export default (req : express.Request, res : express.Response): object => {
  return res.send({
    data: {}
  });
};