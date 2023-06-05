import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class MessageService {
  constructor() {}
  // Objeto que vai receber tem que ser tipo:
  async createConversation() {
    const conversa = await prisma.conversas_bot_trilha.create({
      data: {
        customer_id: 123, // id do customer
        started_at: new Date(), // primeira mensagem
        finished_at: new Date(), // quando chegou ao fim da conversa
        session_open: true,
      },
    });
    return conversa;
  }

  async finishConversation(conversationId: number) {
    const conversa = await prisma.conversas_bot_trilha.update({
      where: {
        id: conversationId,
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
