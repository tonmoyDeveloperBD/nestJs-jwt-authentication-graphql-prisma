import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from '@nestjs/config';
import configs from './configs';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: process.env.NODE_ENV === 'prod',
            load: configs,
            envFilePath: ['.env'],
        })],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
