import { Message } from "../../types";

export interface IMessages {
  sendWhatsApp(message: Message): Promise<void>;
}
