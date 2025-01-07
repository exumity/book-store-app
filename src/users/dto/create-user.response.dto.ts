import { UserType } from '../../common/enums/user-type.enum';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateUserResponseDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  type: UserType;
}
