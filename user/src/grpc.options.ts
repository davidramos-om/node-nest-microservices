import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const microserviceOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        package: 'hero',
        url: '0.0.0.0:50051',
        protoPath: join(__dirname, '../src/proto/hero.proto'),
    },
};