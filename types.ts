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
