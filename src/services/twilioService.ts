import { Message } from "../../types";
import { IMessages } from "../interfaces/IMessages";
import twilio from "twilio";
import dotenv from "dotenv";
import { IMessageDatabase } from "../interfaces/IMessageDatabase";

dotenv.config();

const accountSid = process.env.SIDTWILIO;
const authToken = process.env.AUTHTOKENTWILIO;

export class TwilioService implements IMessages {
  private client;
  constructor(private messageDatabase: IMessageDatabase) {
    this.client = twilio(accountSid, authToken);
  }
  async sendWhatsApp(message: Message): Promise<void> {
    console.log(message);
    await this.client.messages.create({
      body: `${message.body}`,
      from: message.from,
      to: message.to,
    });
  }

  async sendWhatsAppDialogFlow(
    messageDialogFlow: any,
    From: string,
    To: string,
    customer: number,
    conversationId: number
  ): Promise<void> {
    for (const message of messageDialogFlow.queryResult.responseMessages) {
      try {
        if (message.text) {
          try {
            // Salvar no banco.
            const saveMessage = await this.messageDatabase.createMessage(
              conversationId,
              9999, // Id do Bot
              customer, // Id do cliente
              String(message.text.text),
              String(messageDialogFlow.queryResult.match.intent?.displayName),
              null
            );
            const mensagem: Message = {
              body: String(message.text.text),
              from: To,
              to: From,
            };
            await this.sendWhatsApp(mensagem);
            console.log(saveMessage);
          } catch (error) {
            console.error(error);
          }
        }
      } catch (error) {
        throw new Error("Erro:" + error);
      }
    }
  }
}
