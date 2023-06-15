import { Message, ResponseObjectDialogFlow } from "../../types";

export interface IMessages {
  sendWhatsApp(message: Message): Promise<void>;
  sendWhatsAppDialogFlow(
    messageDialogFlow: ResponseObjectDialogFlow,
    From: string,
    To: string,
    customer: number,
    conversationId: number
  ): Promise<void>;
}
