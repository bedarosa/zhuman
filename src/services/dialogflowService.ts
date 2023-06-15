import dotenv from "dotenv";
import { MessageDialogFlow, ResponseObjectDialogFlow } from "../../types";
import { v4 } from "uuid";
import { TwilioService } from "./twilioService";
import { IAIQuestionAnswering } from "../interfaces/IAIQuestionAnswering ";
import fs from "fs";
import util from "util";
import { MessageService } from "./messageService";
import { ConversationService } from "./conversaService";

dotenv.config();
/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const projectId = process.env.PROJECTID;
const agentId = process.env.AGENTID;
const languageCode = process.env.LANGUAGECODE;
const encoding = process.env.ENCODING;
const sampleRateHertz = process.env.SAMPLERATEHERTZ;

// Imports the Google Cloud Some API library
const { SessionsClient } = require("@google-cloud/dialogflow-cx");

// Example for regional endpoint:
const location = process.env.LOCATION;
/* const client = new SessionsClient({
  apiEndpoint: "us-central1-dialogflow.googleapis.com",
}); */
export class DialogflowService implements IAIQuestionAnswering {
  conversaService: any;
  messageService: any;
  twilioService: any;
  constructor() {
    this.conversaService = new ConversationService();
    this.messageService = new MessageService();
    this.twilioService = new TwilioService(this.messageService);
  }

  async detectIntentAudio(
    telefoneCliente: string,
    pathAudio: string,
    MediaContentType: string,
    session: string
  ): Promise<any> {
    const client = new SessionsClient({
      keyFilename: process.env.DIALOGCREDENTIALS,
      apiEndpoint: process.env.APIENDPOINT,
    });

    //const sessionId = v4();
    const sessionPath = client.projectLocationAgentSessionPath(
      projectId,
      location,
      agentId,
      session
    );

    // Read the content of the audio file and send it as part of the request.
    const readFile = util.promisify(fs.readFile);
    const inputAudio = await readFile(pathAudio);

    const request = {
      session: sessionPath,
      queryInput: {
        audio: {
          config: {
            enableAutomaticPunctuation: true,
            audioEncoding: encoding,
            sampleRateHertz: sampleRateHertz,
            model: "default",
          },
          audio: inputAudio,
        },
        languageCode,
      },
    };
    const [response] = await client.detectIntent(request);
    console.log(`User Query: ${response.queryResult.transcript}`);

    console.log(response, "Response");
    for (const message of response.queryResult.responseMessages) {
      if (message.text) {
        console.log(`Agent Response: ${message.text.text}`);
      }
    }
    if (response.queryResult.match?.intent) {
      console.log(
        `Matched Intent: ${response.queryResult.match.intent.displayName}`
      );
    }
    console.log(
      `Current Page: ${response.queryResult.currentPage.displayName}`
    );

    return response as any;
  }

  async detectIntentText(
    message: string,
    session: string
  ): Promise<MessageDialogFlow[] | any> {
    console.log(session);

    // Se a Pessoa já foi atendida ele não inicia o atendimento.
    /* const alreadyBeenAnswered = await this.databaseService.alreadyBeenAnswered(
      telefoneCliente
    );

    if (alreadyBeenAnswered) {
      return;
    } */
    let sessionId;
    // verifica se o numero já tem uma sessionID em aberto
    // se tiver envia a mesmo
    // se não tiver cria uma e salva no banco atrelada ao numero como aberta
    if (session) {
      console.log("if");
      sessionId = session;
    } else {
      console.log("else");
      sessionId = v4();
      await this.messageService.createSession(sessionId);
    }

    console.log(sessionId);

    const client = new SessionsClient({
      keyFilename: process.env.DIALOGCREDENTIALS,
      apiEndpoint: process.env.APIENDPOINT,
    });

    const sessionPath = client.projectLocationAgentSessionPath(
      projectId,
      location,
      agentId,
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: message,
        },
        languageCode,
      },
    };
    const [response] = await client.detectIntent(request);

    if (response.queryResult.match.intent?.displayName == "fim.fazer") {
      await this.conversaService.finishConversation(sessionId);
    }
    //console.log("Aqui!");
    for (const message of response.queryResult.responseMessages) {
      if (message.text) {
        console.log(`Agent Response: ${message.text.text}`);
      }
    }
    if (response.queryResult.match.intent) {
      console.log(
        `Matched Intent: ${response.queryResult.match.intent.displayName}`
      );
    }
    console.log(
      `Current Page: ${response.queryResult.currentPage.displayName}`
    );
    return response as any;
  }
}
