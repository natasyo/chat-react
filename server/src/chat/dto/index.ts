export class MessageDTO {
  text: string;
  email: string;
}

export class MessagePrivateDTO {
  senderEmail: string;
  recipientEmail: string;
  text: string;
}

export * from './getMessagesDto';
