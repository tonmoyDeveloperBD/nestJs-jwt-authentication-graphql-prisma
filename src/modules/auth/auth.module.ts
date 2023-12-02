import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import {PrismaService} from "../../prisma/prisma.service";
import {ConfigService} from "@nestjs/config";
import {TokenService} from "./token.service";
import {JwtModule} from "@nestjs/jwt";

@Module({
  imports:[JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.ACCESS_TOKEN_LIFETIME },
  }),],
  providers: [AuthResolver, AuthService,PrismaService,ConfigService,TokenService]
})
export class AuthModule {}
