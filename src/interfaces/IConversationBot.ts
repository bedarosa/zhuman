import * as express from "express";

export interface IConversationBot {
  conversation(req: express.Request, res: express.Response): Promise<void>;
}
