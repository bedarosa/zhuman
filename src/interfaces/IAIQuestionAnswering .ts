import { MessageDialogFlow } from "../../types";

export interface IAIQuestionAnswering {
  detectIntentText(
    message: string,
    session: string
  ): Promise<MessageDialogFlow[] | any>;

  detectIntentAudio(
    telefoneCliente: string,
    pathAudio: string,
    MediaContentType: string,
    session: string
  ): Promise<MessageDialogFlow[] | any>;
}
