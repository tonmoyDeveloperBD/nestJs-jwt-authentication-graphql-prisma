import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from '@nestjs/config';
import configs from './app/configs';
import {join} from "path";
import {GraphQLModule} from "@nestjs/graphql";
import {ApolloDriver} from "@nestjs/apollo";
import {UsersModule} from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import {JwtStrategy} from "./shared/strategy/jwt.strategy";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {APP_GUARD} from "@nestjs/core";
import {RoleGuard} from "./shared/guard/role.guard";
import {PrismaService} from "./prisma/prisma.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: process.env.NODE_ENV === 'prod',
            load: configs,
            envFilePath: ['.env'],
        }),
        GraphQLModule.forRoot({
            driver: ApolloDriver,
            playground: true,
            autoSchemaFile: join(process.cwd(), 'src/app/schema/schema.gql'),
            sortSchema: true,
            upload: false,
        }),
        UsersModule,
        AuthModule],
    controllers: [AppController],
    providers: [AppService,
        JwtStrategy,
        JwtService,
        {
            provide: APP_GUARD,
            useClass: RoleGuard,
        },
        PrismaService
    ],
})
export class AppModule {
}
