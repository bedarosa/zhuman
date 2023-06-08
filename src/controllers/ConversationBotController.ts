import * as express from "express";
import { Message } from "../../types";
import { IAIQuestionAnswering } from "../interfaces/IAIQuestionAnswering ";
import { IConversationBot } from "../interfaces/IConversationBot";
import { IConversationDatabase } from "../interfaces/IConversationDatabase";
import { ICustomerDatabase } from "../interfaces/ICustomerDatabase";
import { IDownloadMedia } from "../interfaces/IDownloadMedia";
import { IMessageDatabase } from "../interfaces/IMessageDatabase";
import { IMessages } from "../interfaces/IMessages";

export class ConversationBotController implements IConversationBot {
  constructor(
    private messageSender: IMessages,
    private interpretMessage: IAIQuestionAnswering,
    private downloadMedia: IDownloadMedia,
    private conversationDatabase: IConversationDatabase,
    private messageDatabase: IMessageDatabase,
    private customerDatabase: ICustomerDatabase
  ) {}

  async conversation(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const { Body, From, To, MediaUrl0, MediaContentType0 } = req.body;
    // const telefoneFormatado = From.replace(/\D/g, "");
    const telefoneFormatado = "985747852";

    let conversation;
    let session;
    let customer;

    // Checar se tem uma sessão, se tem e estiver fechada ignora
    // se tiver e estiver aberta enviar a sessão ao DG

    // Id da conversa tem que ser uma guid
    const conversationId =
      await this.conversationDatabase.getConversationByPhone(telefoneFormatado);
    // Se ele tem uma sessão e esta fechada não leva pra frente.
    if (conversationId && conversationId.session_open == false) {
      res.sendStatus(200);
      return;
    }
    // Se não tem, nem nunca teve, abre uma sessão (Conversa).
    if (!conversationId) {
      customer = await this.customerDatabase.getCustomerByPhone(
        telefoneFormatado
      );
      conversation = await this.conversationDatabase.createConversation(
        customer.id
      );
      session = conversation.id; //mudar o conversationID para GUID
    } else {
      session = conversationId.id;
    }
    console.log(session);
    console.log(session);
    // Alterar a conversationID que envia pro DG pelo id da conversa do banco

    if (MediaUrl0 || MediaContentType0) {
      const audio = await this.downloadMedia.downloadAudio(
        MediaUrl0,
        telefoneFormatado,
        MediaContentType0
      );

      const response = await this.interpretMessage.detectIntentAudio(
        telefoneFormatado,
        audio,
        MediaContentType0,
        session
      );

      // Transformar em metodo.
      for (const message of response) {
        try {
          if (message.text) {
            try {
              // Salvar no banco.
              const saveMessage = await this.messageDatabase.createMessage(
                conversation,
                1, // Id do Bot
                customer.id, // Id do cliente
                message.text.text
              );
              const mensagem: Message = {
                body: message.text.text,
                from: From,
                to: To,
              };
              this.messageSender.sendWhatsApp(mensagem);
              console.log(saveMessage);
            } catch (error) {
              console.error(error);
            }
          }
        } catch (error) {}
      }
      res.sendStatus(200);
      return;
    }

    const response = await this.interpretMessage.detectIntentText(
      telefoneFormatado,
      Body,
      session
    );

    // Se response retornar vazio o usuario não obtem resposta
    /* if (!response) {
      res.sendStatus(200);
      return;
    } */

    for (const message of response) {
      try {
        if (message.text) {
          try {
            const saveMessage = await this.messageDatabase.createMessage(
              conversation,
              1, // Id do Bot
              customer.id, // Id do cliente
              message.text.text
            );
            const mensagem: Message = {
              body: message.text.text,
              from: From,
              to: To,
            };
            this.messageSender.sendWhatsApp(mensagem);
            console.log(saveMessage);
          } catch (error) {
            console.error(error);
          }
        }
      } catch (error) {}
    }

    //this.messageSender.sendWhatsApp(message);
    res.sendStatus(200);
    return;
  }
}
