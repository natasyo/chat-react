export interface MessageDTO {
  text: string;
  email: string;
}

export interface MessagePrivateDTO {
  senderEmail: string;
  recipientEmail: string;
  text: string;
}
