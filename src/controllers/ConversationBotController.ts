import * as express from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ResponseObjectDialogFlow } from "../../types";
import { IAIQuestionAnswering } from "../interfaces/IAIQuestionAnswering ";
import { IConversationBot } from "../interfaces/IConversationBot";
import { IConversationDatabase } from "../interfaces/IConversationDatabase";
import { ICustomerDatabase } from "../interfaces/ICustomerDatabase";
import { IDownloadMedia } from "../interfaces/IDownloadMedia";
import { IMessageDatabase } from "../interfaces/IMessageDatabase";
import { IMessages } from "../interfaces/IMessages";

interface Buffer {
  messages: string[];
  timer: NodeJS.Timeout | any;
}

const messageBuffers: { [key: string]: Buffer } = {};
const WAIT_TIME = 15000;

export class ConversationBotController implements IConversationBot {
  constructor(
    private messageSender: IMessages,
    private interpretMessage: IAIQuestionAnswering,
    private downloadMedia: IDownloadMedia,
    private conversationDatabase: IConversationDatabase,
    private messageDatabase: IMessageDatabase,
    private customerDatabase: ICustomerDatabase
  ) {}

  // Mudar nome para algo relacionado a espera

  // Mudar para conversation
  async conversation(
    req: express.Request,
    res: express.Response,
    Body: string,
    From: string,
    To: string,
    telefoneFormatado: string,
    MediaUrl0: string,
    MediaContentType0: string
  ) {
    let conversation;
    let session;

    // Checar se tem uma sessão, se tem e estiver fechada ignora
    // se tiver e estiver aberta enviar a sessão ao DG

    // Id da conversa tem que ser uma guid
    let conversationId = await this.conversationDatabase.getConversationByPhone(
      telefoneFormatado
    );

    // Se ele tem uma sessão e esta fechada não leva pra frente.
    if (conversationId && conversationId.session_open == false) {
      res.send({ Message: "teste" });
      return;
    }
    // Se não tem, nem nunca teve, abre uma sessão (Conversa).
    const customer = await this.customerDatabase.getCustomerByPhone(
      telefoneFormatado
    );
    if (!conversationId) {
      conversation = await this.conversationDatabase.createConversation(
        customer.id
      );
      session = conversation.id; //mudar o conversationID para GUID
      conversationId = conversation?.id;
    } else {
      session = conversationId.id;
      conversationId = conversationId.id;
    }

    // Alterar a conversationID que envia pro DG pelo id da conversa do banco
    try {
      const message = await this.messageDatabase.createMessage(
        conversationId,
        Number(customer.id),
        9999,
        String(Body),
        null,
        null
      );
    } catch (error) {
      console.error(error);
    }

    if (MediaUrl0 || MediaContentType0) {
      const audio = await this.downloadMedia.downloadAudio(
        MediaUrl0,
        telefoneFormatado,
        MediaContentType0
      );

      const response: any = await this.interpretMessage.detectIntentAudio(
        telefoneFormatado,
        audio,
        MediaContentType0,
        session
      );

      await this.messageSender.sendWhatsAppDialogFlow(
        response,
        From,
        To,
        Number(customer.id),
        conversationId
      );

      res.send({ Message: "teste" });
      return;
    }

    const response: any = await this.interpretMessage.detectIntentText(
      Body,
      session
    );

    // Se response retornar vazio o usuario não obtem resposta
    /* if (!response) {
      res.sendStatus(201);
      return;
    } */

    await this.messageSender.sendWhatsAppDialogFlow(
      response,
      From,
      To,
      Number(customer.id),
      conversationId
    );
    res.send({ Message: "teste" });
    return;
  }
}
