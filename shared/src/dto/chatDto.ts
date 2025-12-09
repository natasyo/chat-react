

export interface IGetMessagesDto {
    sender: string ;
    recipient: string;
    cursor?: string;
    take :number;
}
