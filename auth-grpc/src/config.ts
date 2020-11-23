import { ADAPTER } from './common/enums';

const config = {

    JWT_SECRETKEY: "MjAtYXV0aC10b2tlbi1nZW4tZ2xvYmFsLWRldmVsYXBwLTIwLWhuLWZsLXVz", //=20-auth-token-gen-global-develapp-20-hn-fl-us
    EXPIRESIN: '24h',
    APP_ADAPTER: ADAPTER.FASTITY,
    ENVIROMENT: 'development',
    LOGGER: false,
    GEN_DOCS: true,
    PORT_HTTP: 50050,
    db: {
        regional: {
            name: 'core',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'rf3t46qjgw',
            database: 'regional',
            synchronize: false,
            logging: true,
        }
    },
    micro: {
        me: {
            name: 'AUTH_PACKAGE',
            serviceName: 'AuthService',
            HOST: 'localhost',
            package: 'auth',
            PORT_GRPC: 50051,
            PORT_TCP: 50052
        },
        users: {
            name: 'USER_CLIENT',
            HOST: 'localhost',
            PORT: 5011,
        }
    }
}

export default config;