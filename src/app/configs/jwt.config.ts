import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
    secret: process.env.JWT_SECRET,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    access_token_lifetime: process.env.ACCESS_TOKEN_LIFETIME,
    refresh_token_lifetime: process.env.REFRESH_TOKEN_LIFETIME
}));