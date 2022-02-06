import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/schemas/user.schema';

export const LimitedTo = (...roles: Array<Role>) => SetMetadata('roles', roles);
