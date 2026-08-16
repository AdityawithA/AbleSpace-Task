import { IsString, Length } from 'class-validator';

export class GuestLoginDto {
  @IsString()
  @Length(1, 50, { message: 'Name must be between 1 and 50 characters' })
  name: string;
}
