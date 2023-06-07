import { PrismaClient } from "@prisma/client";
import { IConversationDatabase } from "../interfaces/IConversationDatabase";

const prisma = new PrismaClient();

export class ConversationService implements IConversationDatabase {
  constructor() {}
  // Objeto que vai receber tem que ser tipo:
  async createConversation(customer_id: number) {
    const conversa = await prisma.conversas_bot_trilha.create({
      data: {
        customer_id: customer_id, // id do customer
        started_at: new Date(), // primeira mensagem
        finished_at: new Date(), // quando chegou ao fim da conversa
        session_open: true,
      },
    });
    return conversa;
  }

  async finishConversation(conversation_id: number) {
    const conversa = await prisma.conversas_bot_trilha.update({
      where: {
        id: conversation_id,
      },
      data: {
        session_open: false,
      },
    });
    return conversa;
  }

  async getConversasByCustomerId(customer_id: number) {
    const conversas = await prisma.conversas_bot_trilha.findMany({
      where: {
        customer_id: customer_id,
      },
    });

    return conversas;
  }
}
