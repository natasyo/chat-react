import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IGetMessagesDto } from '@chat/shared';

export class GetMessagesDto implements IGetMessagesDto {
  @IsString()
  @IsNotEmpty()
  sender: string;
  @IsString()
  @IsNotEmpty()
  recipient: string;
  @IsString()
  cursor?: string;

  @IsNumber()
  take = 20;
}
