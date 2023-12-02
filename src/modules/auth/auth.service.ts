import {HttpException, Injectable} from '@nestjs/common';
import {PrismaService} from "../../prisma/prisma.service";
import {ConfigService} from "@nestjs/config";
import {AuthSignupInput} from "./dto/auth-signup.input";
import {MessageEnum} from "../../shared/enums/message.enum";
import {HttpStatusCode} from "axios";
import {AuthSignInInput} from "./dto/auth-signin.input";
import {TokenService} from "./token.service";

@Injectable()
export class AuthService {

    constructor(private readonly prismService: PrismaService,
                private readonly configService: ConfigService,
                private readonly tokenService: TokenService) {
    }

    async signIn(authSignInInput:AuthSignInInput){
        let userData = await this.prismService.user.findFirst({
            where: {
                email: authSignInInput.email
            },
            select:{
                refreshToken:false,
                id:true,
                password:true,
                email:true,
                name:true,
                userPermission:true,
                createdAt:true,
                updatedAt:true
            }
        })
        if (!Boolean(userData)){
            throw new HttpException(MessageEnum.USER_NOT_FOUND, HttpStatusCode.BadRequest)
        }

        let compareResult = await this.tokenService.compareHash(authSignInInput.password, userData.password)
        if (!compareResult){
            throw new HttpException(MessageEnum.INVALID_PASSWORD, HttpStatusCode.BadRequest)
        }


        // update refresh token
        let refreshToken = await this.tokenService.refreshTokenGenerate(userData)
        let accessToken = await this.tokenService.accessTokenGenerator({
            ...userData,
            refreshToken
        })
        await this.prismService.user.update({
            where: {
                id: userData.id
            },
            data: {
                refreshToken: refreshToken
            }
        })

        return accessToken
    }

    async signUp(authSignupInput: AuthSignupInput) {
        let isExist = await this.prismService.user.findFirst({
            where: {
                email: authSignupInput.email
            }
        })
        if (Boolean(isExist)){
            throw new HttpException(MessageEnum.USER_ALREADY_EXIST, HttpStatusCode.BadRequest)
        }
        let userCreateResult = await this.prismService.user.create({
            data: {
                email: authSignupInput.email,
                name: authSignupInput.name,
                password: await this.tokenService.hashPassword(authSignupInput.password)
            }
        })

        let refreshToken = await this.tokenService.refreshTokenGenerate(userCreateResult)
        let accessToken = await this.tokenService.accessTokenGenerator({
            ...userCreateResult,
            refreshToken
        })
        //update refreshToken
        await this.prismService.user.update({
            where: {
                id: userCreateResult.id
            },
            data: {
                refreshToken: refreshToken
            }
        })

        return accessToken
    }

    async getAccessTokenFromRefreshToken(refreshToken: string) {
        return this.tokenService.getAccessTokenFromRefreshToken(refreshToken)
    }
}
