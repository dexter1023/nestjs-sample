import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { compare } from 'bcrypt';
import { ITokenPayload } from './interfaces/token.payload.interface';
import { ConfigService } from '@nestjs/config';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  createToken(payload: ITokenPayload): string {
    const privateKey = this.configService.get('PRIVATE_KEY');
    const token = sign(payload, privateKey);
    return token;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const client = await this.userService.getUserByEmail(email);
    if (client && (await compare(password, client.password))) {
      const { password, ...result } = client;
      return result;
    }
  }
}
