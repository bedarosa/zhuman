export interface IMessageDatabase {
  createMessage(
    conversa_id: number,
    sender_id: number,
    recipient_id: number,
    message_text: string,
    intentions: string | null,
    lida: null
  ): any;
}
