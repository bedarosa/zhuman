import dotenv from "dotenv";
import { MessageDialogFlow } from "../../types";
import { v4 } from "uuid";
import { SessionService } from "./sessionService";
import { TwilioService } from "./twilioService";
import { IAIQuestionAnswering } from "../interfaces/IAIQuestionAnswering ";
import fs from "fs";
import util from "util";

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
  databaseService: any;
  twilioService: any;
  constructor() {
    this.databaseService = new SessionService();
    this.twilioService = new TwilioService();
  }

  async detectIntentAudio(
    telefoneCliente: string,
    pathAudio: string,
    MediaContentType: string
  ): Promise<any> {
    //const filename = pathAudio;
    //const extensaoMedia = MediaContentType.split("/")[1];

    const sessionInProgress = await this.databaseService.getSessionOpened(
      telefoneCliente
    );

    // verifica se o numero já tem uma sessionID em aberto
    // se tiver envia a mesmo
    // se não tiver cria uma e salva no banco atrelada ao numero como aberta

    let sessionId;
    if (sessionInProgress) {
      console.log("if");
      sessionId = sessionInProgress.id;
    } else {
      console.log("else");
      sessionId = v4();
      await this.databaseService.createSession(telefoneCliente);
    }

    const client = new SessionsClient({
      keyFilename: process.env.DIALOGCREDENTIALS,
      apiEndpoint: process.env.APIENDPOINT,
    });

    //const sessionId = v4();
    const sessionPath = client.projectLocationAgentSessionPath(
      projectId,
      location,
      agentId,
      sessionId
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
    if (response.queryResult.match.intent) {
      console.log(
        `Matched Intent: ${response.queryResult.match.intent.displayName}`
      );
    }
    console.log(
      `Current Page: ${response.queryResult.currentPage.displayName}`
    );

    return response.queryResult.responseMessages as MessageDialogFlow[];
  }

  async detectIntentText(
    telefoneCliente: string,
    message: string
  ): Promise<MessageDialogFlow[] | any> {
    const session = await this.databaseService.getSessionOpened(
      telefoneCliente
    );

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
      sessionId = session.id;
    } else {
      console.log("else");
      sessionId = v4();
      await this.databaseService.createSession(telefoneCliente);
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
      await this.databaseService.finishSession(sessionId);
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
    return response.queryResult.responseMessages as MessageDialogFlow[];
  }
}
