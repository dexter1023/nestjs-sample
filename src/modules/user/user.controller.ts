import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { IAuthRequest } from 'src/core/auth/interfaces/auth.request.interface';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(@Res() res: Response): Promise<any> {
    const users = await this.userService.getUsers();
    res.json(users);
  }

  @Post()
  async createUser(@Body(new ValidationPipe({transform: true})) user: CreateUserDto, @Res() res: Response): Promise<any> {
    const createdUser = await this.userService.saveUser(user)
    res.json(createdUser)
  }

  @UseGuards(AuthGuard('user'))
  @Put()
  async updateUser(
    @Body(new ValidationPipe({ transform: true })) user: UpdateUserDto,
    @Req() req: IAuthRequest,
    @Res() res: Response,
  ): Promise<any> {
    const updatedUser = await this.userService.updateUser(req.user.id, user);
    res.json(updatedUser);
  }
}
