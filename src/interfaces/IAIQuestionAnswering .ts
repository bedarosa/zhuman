import { MessageDialogFlow } from "../../types";

export interface IAIQuestionAnswering {
  detectIntentText(
    telefoneCliente: string,
    message: string
  ): Promise<MessageDialogFlow[] | any>;

  detectIntentAudio(
    telefoneCliente: string,
    pathAudio: string,
    MediaContentType: string
  ): Promise<MessageDialogFlow[] | any>;
}
