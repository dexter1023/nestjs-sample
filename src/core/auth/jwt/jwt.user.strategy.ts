import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ITokenPayload } from '../interfaces/token.payload.interface';
import { ConfigService } from '@nestjs/config';
import { IAuthRequest } from '../interfaces/auth.request.interface';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class LocalUserStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(
    private readonly userService: UserService,
    configService: ConfigService,
  ) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: configService.get('PRIVATE_KEY'),
        passReqToCallback: true,
      },
      async (req, payload, next) => await this.validate(req, payload, next),
    );
  }

  async validate(
    req: IAuthRequest,
    payload: ITokenPayload,
    done: (arg: any, payload: ITokenPayload) => any,
  ): Promise<any> {
    const user = await this.userService.getUserByEmail(payload.email);
    if (!user) {
      return done('Unauthorized', null);
    }
    req.user = user;
    done(null, payload);
  }
}
