import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './user.dto';
import { hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async saveUser(user: CreateUserDto): Promise<UserResponseDto> {
      const isUserExists = await this.userRepository.findOne({email: user.email})
      if(isUserExists) {
        throw new BadRequestException('Uzytkownik o tym adresie email juz istnieje')
      } else {
        const hashPassword = await hash(user.password, 10);
        user.password = hashPassword;
        const {password, ...savedUser} = await this.userRepository.save(user);
        return savedUser;
      }
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        email,
      });
      return user;
    } catch (e) {
      throw e;
    }
  }

  async getUserById(id: number): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({ id });
      return user;
    } catch (e) {
      throw e;
    }
  }

  async getUsers(): Promise<UserResponseDto[]> {
    try {
      const users = await this.userRepository.find({
        select: ['firstName', 'lastName', 'email', 'id'],
      });
      return users;
    } catch (e) {
      throw e;
    }
  }

  async updateUser(id: number, user: UpdateUserDto): Promise<UserResponseDto> {
    try {
      const foundUser = await this.getUserById(id);
      if (foundUser) {
        const updatedUser = await this.userRepository.save({
          ...foundUser,
          ...user,
        });
        return updatedUser;
      } else {
        throw new Error('Nie ma takiego użytkownika');
      }
    } catch (e) {
      throw e;
    }
  }
}
