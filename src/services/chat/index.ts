import express, { NextFunction, Request, Response } from "express";

const chatRouter = express.Router();

chatRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  console.log("test");
  res.status(200).send();
});

export default chatRouter;
