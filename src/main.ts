import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from '@nestjs/config';
import * as cowsay from 'cowsay';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import validationOptions from './shared/utils/validation-options';
import {ValidationPipe} from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);

    app.setGlobalPrefix(config.get('app.prefix'), {
        exclude: ['/'],
    });

    app.use(bodyParser.json({limit: '100mb'}));
    app.use(
        bodyParser.urlencoded({
            limit: '20mb',
            parameterLimit: 10000,
            extended: true,
        }),
    );

    /**
     * Validation Pipe for formatting validation error
     */
    app.useGlobalPipes(new ValidationPipe(validationOptions));

    /**
     * Enable cookie parser
     */
    app.use(cookieParser());

    /**
     * Enable cors
     */
    app.enableCors({
        origin: true,
        credentials: true,
    });

    /**
     * boot the app porting the config.port
     */
    const port = config.get('app.port');
    await app.listen(port);

    /**
     * Print the application name and environment.
     */
    const appUrl = config.get('app.url');
    const docSuffix = config.get('app.doc');
    const say = cowsay.say({
        text: `App is running at ${appUrl} | GraphQL Playground: ${appUrl}/${`graphql`}`,
    });
    console.log(say);
}

bootstrap().then((r) => {

});
