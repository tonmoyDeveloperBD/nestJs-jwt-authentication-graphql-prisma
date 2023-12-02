import {HttpException, Injectable} from "@nestjs/common";
import {HttpStatusCode} from "axios";
import {sign, verify} from "jsonwebtoken";
import * as bcrypt from "bcrypt"
import {ConfigService} from "@nestjs/config";

@Injectable()
export class TokenService {

    constructor(private readonly configService: ConfigService) {
    }

    async verifyRefreshToken(refreshToken: string) {
        try {
            const decoded = verify(refreshToken, this.configService.get('JWT_SECRET'));
            return decoded;
        } catch (error) {
            throw new HttpException('Invalid refresh token', HttpStatusCode.Unauthorized);
        }
    }


    async getAccessTokenFromRefreshToken(refreshToken: string) {
        let userData;

        try {
            const decodedRefreshToken = await this.verifyRefreshToken(refreshToken);
            userData = decodedRefreshToken;
            const accessTokenLifetime = this.configService.get('ACCESS_TOKEN_LIFETIME');
            return this.accessTokenGenerator(userData);
        } catch (error) {
            // Check if the error is due to an expired refresh token
            if (error.name === 'TokenExpiredError' && error.message === 'jwt expired') {
                // Generate a new refresh token
                const newRefreshToken = await this.refreshTokenGenerate(userData);

                // Use the new refresh token to generate the access token
                const accessToken = await this.accessTokenGenerator({
                    ...userData,
                    refreshToken: newRefreshToken
                });

                // Optionally, update the database with the new refresh token

                return accessToken;
            }

            // If it's a different error, rethrow it
            throw error;
        }
    }


    // async getAccessTokenFromRefreshToken(refreshToken: string) {
    //     const decodedRefreshToken = await this.verifyRefreshToken(refreshToken);
    //     const userData = decodedRefreshToken;
    //     const accessTokenLifetime = this.configService.get('ACCESS_TOKEN_LIFETIME');
    //     return this.accessTokenGenerator(userData);
    // }

    async accessTokenGenerator(userData: any) {
        return sign(userData, this.configService.get("JWT_SECRET"), {
            expiresIn: this.configService.get("ACCESS_TOKEN_LIFETIME")
        });
    }

    async refreshTokenGenerate(userData: any) {
        try {
            const refreshTokenLifetime = this.configService.get('REFRESH_TOKEN_LIFETIME');
            const refreshToken = sign(userData, this.configService.get('JWT_SECRET'), {
                expiresIn: refreshTokenLifetime,
            });
            return refreshToken;
        } catch (error) {
            throw new Error('Error generating refresh token');
        }
    }

    async hashPassword(password: string) {
        return bcrypt.hash(password, 17);
    }

    async compareHash(password: string, hash: string) {
        return bcrypt.compare(password, hash);
    }

}

