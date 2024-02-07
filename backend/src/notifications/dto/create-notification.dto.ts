import { IsNotEmpty } from 'class-validator';
import { FromWhom, ToWhom } from '../schema/notifications.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ description: 'id отправителя', nullable: false })
  @IsNotEmpty()
  fromWhom: FromWhom;

  @ApiProperty({ description: 'id получателя', nullable: false })
  @IsNotEmpty()
  toWhom: ToWhom;

  @ApiProperty({ description: 'содержимое', nullable: false })
  @IsNotEmpty()
  message: object;
}
