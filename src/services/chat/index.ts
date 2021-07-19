import express, { NextFunction, Request, Response } from "express";

const chatRouter = express.Router();

//Get all my Chats
chatRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  console.log("test");
  res.status(200).send();
});
chatRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
      next(error);
    }
    res.status(200).send();
  }
);

//Get Chat by ID
chatRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
      next(error);
    }
    res.status(200).send();
  }
);

//Delete Chat
chatRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
      next(error);
    }
    res.status(200).send();
  }
);

// Chat participants
chatRouter.post(
  "/:id/participants",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
      next(error);
    }
    res.status(200).send();
  }
);

chatRouter.delete(
  "/:id/participants/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
      next(error);
    }
    res.status(200).send();
  }
);

export default chatRouter;
