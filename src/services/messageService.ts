import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class MessageService {
  constructor() {}
  // Objeto que vai receber tem que ser tipo:
  async createMessage(
    conversa_id: number,
    sender_id: number,
    recipient_id: number,
    intentions: string
  ) {
    const message = await prisma.mensagens_bot_trilha.create({
      data: {
        conversa_id: conversa_id,
        sender_id: sender_id,
        recipient_id: recipient_id,
        sent_at: new Date(),
        intentions: intentions,
      },
    });
    return message;
  }
}
