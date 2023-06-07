export interface IConversationDatabase {
  createConversation(customer_id: number): any;
  finishConversation(conversation_id: number): any;
  getConversationByCustomerId(customer_id: number): any;
  getConversationByPhone(phone: number): any;
}
