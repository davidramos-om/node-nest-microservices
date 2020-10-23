import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { url } from 'inspector';

export const SetupDocs = (app: INestApplication) =>
{
    const options = new DocumentBuilder()
        .setTitle('User service')
        .setDescription('Develapp® is your business application Designed to help you achieve more ')
        .setVersion('1.0')
        .addBearerAuth()
        .setContact("Develapp LLC", "https://mydevelapp.com/", "help@develapp.com")
        .build();

    const document = SwaggerModule.createDocument(app, options);


    SwaggerModule.setup('api/docs', app, document, {
        explorer: true,
        swaggerOptions: {
            filter: true,
            showRequestDuration: true
        }
    });

}