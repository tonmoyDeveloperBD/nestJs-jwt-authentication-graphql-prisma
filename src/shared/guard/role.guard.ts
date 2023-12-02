import {Injectable, CanActivate, ExecutionContext, ForbiddenException} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {GqlExecutionContext} from '@nestjs/graphql';
import {JwtService} from '@nestjs/jwt';
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector,
                private readonly prismaService: PrismaService,
                private readonly jwtService: JwtService,) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const gqlContext = GqlExecutionContext.create(context);
        const ctx = gqlContext.getContext();
        const authorization = ctx.req.headers['authorization'];


        if (!authorization) {
            throw new ForbiddenException('Authorization token not provided');
        }

        const token = authorization.replace('Bearer ', '');
        const decodedToken = this.jwtService.decode(token) as { id: string, name: string, email: string, refreshToken: string, roles: string[] };

        let findRequiredRole = await this.prismaService.role.findFirst({
            where: {
                name: {
                    in: requiredRoles
                }
            }
        })

        if (!findRequiredRole) {
            throw new ForbiddenException('Role not found');
        }

        let userPermission = await this.prismaService.userPermission.findFirst({
            where: {
                uId: decodedToken.id,
                roleId: findRequiredRole.id
            }
        })

        if (Boolean(userPermission)) {
            return true;
        }else {
            throw new ForbiddenException('Insufficient role permissions');
        }
    }

}
