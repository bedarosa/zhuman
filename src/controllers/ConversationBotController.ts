import * as express from "express";
import { Message, MessageDialogFlow } from "../../types";
import { IAIQuestionAnswering } from "../interfaces/IAIQuestionAnswering ";
import { IConversationBot } from "../interfaces/IConversationBot";
import { IDownloadMedia } from "../interfaces/IDownloadMedia";
import { IMessages } from "../interfaces/IMessages";

export class ConversationBotController implements IConversationBot {
  constructor(
    private messageSender: IMessages,
    private interpretMessage: IAIQuestionAnswering,
    private downloadMedia: IDownloadMedia
  ) {}

  async conversation(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const { Body, From, MediaUrl0, MediaContentType0 } = req.body;
    /* console.log(Body);
    console.log(From);
    console.log(MediaUrl0);
    console.log(MediaContentType0); */

    if (MediaUrl0 || MediaContentType0) {
      const audio = await this.downloadMedia.downloadAudio(
        MediaUrl0,
        From,
        MediaContentType0
      );

      const response: MessageDialogFlow[] =
        await this.interpretMessage.detectIntentAudio(
          From,
          audio,
          MediaContentType0
        );

      if (!response) {
        res.sendStatus(200);
        return;
      }

      for (const message of response) {
        try {
          if (message.text) {
            try {
              const mensagem: Message = {
                body: message.text.text,
                from: "whatsapp:+14155238886",
                to: "whatsapp:+555185747852",
              };
              this.messageSender.sendWhatsApp(mensagem);
            } catch (error) {
              console.error(error);
            }
          }
        } catch (error) {}
      }
      res.sendStatus(200);
      return;
    }

    const telefoneCliente = From.replace(/\D/g, "");
    const response = await this.interpretMessage.detectIntentText(
      telefoneCliente,
      Body
    );

    // Se response retornar vazio o usuario não obtem resposta
    if (!response) {
      res.sendStatus(200);
      return;
    }
    for (const message of response) {
      try {
        if (message.text) {
          try {
            const mensagem: Message = {
              body: message.text.text,
              from: "whatsapp:+14155238886",
              to: "whatsapp:+555185747852",
            };
            this.messageSender.sendWhatsApp(mensagem);
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
