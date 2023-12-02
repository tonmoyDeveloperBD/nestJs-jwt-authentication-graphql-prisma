import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { GqlAuthGuard } from "../guard/gql-auth.guard";

export const Roles  = (...roles: string[]) => {
  return applyDecorators(
    UseGuards(GqlAuthGuard),
    SetMetadata('roles', roles),
  );
};