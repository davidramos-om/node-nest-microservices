import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import * as fs from 'fs';
import * as helmet from 'fastify-helmet';

import config from './config';
import { AppModule } from './app.module';
import { ENVIROMENT } from './common/enums';

const logger = new Logger('AuthServices');

const grpc_microservices_options = {
  transport: Transport.GRPC,
  options: {
    name: config.micro.me,
    url: `${config.micro.me.HOST}:${config.micro.me.PORT_GRPC}`,
    protoPath: join(__dirname, '../src/proto/auth.proto'),
    package: config.micro.me.package,
    loader: { keepCase: true },
  },
};

const tpc_microservices_options = {
  transport: Transport.TCP,
  options: {
    options: {
      host: config.micro.me.HOST,
      port: config.micro.me.PORT_TCP
    }
  },
};

async function bootstrap()
{
  const httpsOptions = {
    key: fs.readFileSync('./private/key.pem', 'utf8'),
    cert: fs.readFileSync('./private/server.crt', 'utf8')
  };

  const serverOptions = { logger: config.LOGGER, https: httpsOptions, http2: true };
  const adapter = new FastifyAdapter(serverOptions);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, { logger: logger });

  app.connectMicroservice(grpc_microservices_options);
  app.connectMicroservice(tpc_microservices_options);

  //Security
  if (config.ENVIROMENT === ENVIROMENT.LIVE)
    app.getHttpAdapter().getInstance().register(helmet);

  await app.startAllMicroservicesAsync();
  await app.listen(config.PORT_HTTP);

  Logger.log('Auth microservice running', 'Bootstrap');
  Logger.log('GRPC Services on https://localhost: ' + config.micro.me.PORT_GRPC);
  Logger.log('TCP  Services on https://localhost: ' + config.micro.me.PORT_TCP);
  Logger.log(`HTTP Services on ${await app.getUrl()}`);
}

bootstrap();
