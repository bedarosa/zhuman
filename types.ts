export interface Lead {
  id: number;
  name: string;
  email: string;
}

export interface Message {
  body: string;
  from: string;
  to: string;
}

export interface MessageDialogFlow {
  channel: string;
  text: {
    text: string[];
    allowPlaybackInterruption: boolean;
  };
  message: string;
}

export interface MessageTwilio {}

export interface SessionId {
  id: string;
  telefone: string;
  opened: number;
  createdAt: Date;
}

interface ResponseMessage {
  channel: string;
  text: {
    text: string[];
    allowPlaybackInterruption: boolean;
  };
  message: string;
}

interface WebhookStatus {
  details: any[];
  code: number;
  message: string;
}

export interface ResponseObjectDialogFlow {
  responseId: string; // Id da mensagem
  queryResult: {
    responseMessages: ResponseMessage[];
    webhookPayloads: object[];
    webhookStatuses: WebhookStatus[];
    languageCode: string;
    parameters: null;
    currentPage: {
      transitionRoutes: any[];
      eventHandlers: any[];
      transitionRouteGroups: any[];
      name: string;
      displayName: string; //Em qual page estava
      form: null;
      entryFulfillment: null;
    };
    intent: {
      trainingPhrases: any[];
      parameters: any[];
      labels: {};
      name: string;
      displayName: string; //Qual intenção atende a resposta
      priority: number;
      isFallback: boolean;
      description: string;
    };
    intentDetectionConfidence: number;
    diagnosticInfo: { fields: object };
    match: {
      intent: object;
      parameters: null;
      resolvedInput: string; //Resolved input mesma coisa do texto do user
      matchType: string;
      confidence: number;
      event: string;
    };
    sentimentAnalysisResult: null;
    text: string; // texto do user
    query: string; //text ou audio
  };
  outputAudio: Buffer;
  outputAudioConfig: null;
  responseType: string;
  allowCancellation: boolean;
}
