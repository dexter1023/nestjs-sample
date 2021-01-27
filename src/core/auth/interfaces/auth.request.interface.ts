import { UserEntity } from 'src/entities/user.entity';
import { ITokenPayload } from './token.payload.interface';

export interface IAuthRequest extends Request {
  user: ITokenPayload;
}
