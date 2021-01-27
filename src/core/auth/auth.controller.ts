import { Body, Controller, ForbiddenException, HttpStatus, Post, Res, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthPayloadDto } from './interfaces/auth.payload.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async createToken(
    @Body(new ValidationPipe({transform: true})) body: AuthPayloadDto,
    @Res() res: Response,
  ): Promise<any> {
    const user = await this.authService.validateUser(
      body.email,
      body.password,
    );
    if (user) {
      const { email, firstName, lastName, id } = user;
      const token = this.authService.createToken({
        id,
        email,
        firstName,
        lastName,
      });
      return res.json({ token, email, firstName, lastName });
    } else {
      throw new ForbiddenException('Błędne dane logowania')
    }
  }
}
