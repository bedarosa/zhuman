import { Message } from "../../types";
import { IMessages } from "../interfaces/IMessages";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.SIDTWILIO;
const authToken = process.env.AUTHTOKENTWILIO;

export class TwilioService implements IMessages {
  private client;
  constructor() {
    this.client = twilio(accountSid, authToken);
  }
  async sendWhatsApp(message: Message): Promise<void> {
    await this.client.messages.create({
      body: `${message.body}`,
      from: message.from,
      to: message.to,
    });
  }

  async sendWhatsAppDialogFlow(): Promise<void> {}
}
