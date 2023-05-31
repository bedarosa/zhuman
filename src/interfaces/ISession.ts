import { SessionId } from "../../types";

export interface ISessionDatabase {
  getSessions(): Promise<SessionId[]>;
  getSessionOpened(telefone: string): Promise<SessionId>;
  createSession(telefone: string): Promise<any>;
}
