export interface IMessageDatabase {
  createMessage(
    conversa_id: number,
    sender_id: number,
    recipient_id: number,
    intentions: string
  ): any;
}
