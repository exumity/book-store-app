import { UserType } from '../../common/enums/user-type.enum';

export interface AccessTokenPayloadInterface {
  username: string;
  id: string;
  claims: { userType: UserType };
}
