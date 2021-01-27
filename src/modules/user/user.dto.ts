import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class UpdateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}

export class UserResponseDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}
