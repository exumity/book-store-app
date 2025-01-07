import { SetMetadata } from '@nestjs/common';
import { UserType } from '../../common/enums/user-type.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEY, roles);
