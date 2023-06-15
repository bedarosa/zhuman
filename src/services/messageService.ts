import { PrismaClient } from "@prisma/client";
import { IMessageDatabase } from "../interfaces/IMessageDatabase";

const prisma = new PrismaClient();

export class MessageService implements IMessageDatabase {
  constructor() {}
  // Objeto que vai receber tem que ser tipo:
  async createMessage(
    conversa_id: number,
    sender_id: number,
    recipient_id: number,
    message_text: string,
    intentions: string | null,
    lida: null
  ) {
    const message = await prisma.mensagens_bot_trilha.create({
      data: {
        conversa_id: conversa_id,
        sender_id: sender_id,
        recipient_id: recipient_id,
        message_text: message_text,
        intentions: intentions,
        lida: lida,
        sent_at: new Date(),
      },
    });
    return message;
  }
}
