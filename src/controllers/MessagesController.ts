/* import * as express from "express";
import { Message } from "../../types";
import { IMessages } from "../interfaces/IMessages";

export class MessagesController implements IMessages {
  constructor(private messageSender: IMessages) {}

  async sendMessage(req: express.Request, res: express.Response) {
    const message: Message = req.body;
    const sendMessage = await this.messageSender.sendWhatsApp(message);
    console.log(sendMessage);
    res.sendStatus(200);
  }
} */
