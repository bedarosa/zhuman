import { PrismaClient, SessionId } from "@prisma/client";
import { ISessionDatabase } from "../interfaces/ISession";
import { v4 } from "uuid";

export class SessionService implements ISessionDatabase {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getSessions(): Promise<SessionId[]> {
    const sessionIds = await this.prisma.sessionId.findMany();
    return sessionIds as SessionId[];
  }

  async getSessionOpened(telefone: string): Promise<SessionId> {
    const sessionIds = await this.prisma.sessionId.findFirst({
      where: {
        telefone: telefone,
        opened: 1,
      },
    });

    return sessionIds as SessionId;
  }

  async alreadyBeenAnswered(telefone: string) {
    const sessionIds = await this.prisma.sessionId.findFirst({
      where: {
        telefone: telefone,
        opened: 0,
      },
    });

    return sessionIds as SessionId;
  }

  async createSession(telefone: string): Promise<any> {
    const session = await this.prisma.sessionId.create({
      data: {
        id: v4(),
        telefone,
        opened: 1,
        createdAt: new Date(),
      },
    });
    return session;
  }

  async finishSession(id: string): Promise<any> {
    const session = await this.prisma.sessionId.update({
      where: {
        id: id,
      },
      data: {
        opened: 0,
      },
    });
    return session;
  }

  // async saveMessage(): Promise<> {}
}
