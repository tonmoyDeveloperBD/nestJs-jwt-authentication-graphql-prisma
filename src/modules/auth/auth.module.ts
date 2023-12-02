import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import {PrismaService} from "../../prisma/prisma.service";
import {ConfigService} from "@nestjs/config";
import {TokenService} from "./token.service";

@Module({
  providers: [AuthResolver, AuthService,PrismaService,ConfigService,TokenService]
})
export class AuthModule {}
