import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/modules/user/user.module';
import { AuthService } from './auth.service';
import { LocalUserStrategy } from './jwt/jwt.user.strategy';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secretOrPrivateKey: configService.get('PRIVATE_KEY'),
      }),
    }),
  ],
  providers: [AuthService, LocalUserStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
