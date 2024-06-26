import { ADAPTER } from './common/enums';

const config = {
    JWT_SECRETKEY: "DEVEL-024d1f83-683b-4d44-bc29-71a101b2d7fe-APP-AUTH",
    EXPIRESIN: '24h',
    APP_ADAPTER: ADAPTER.FASTITY,
    ENVIROMENT: 'development',
    LOGGER: false,
    GEN_DOCS: true,
    PORT: 4010,
    micro: {
        mp: {
            name: 'AUTH_CLIENT',
            HOST: 'localhost',
            PORT: 4011 //@MessagePattern -> auth
        },
        users: {
            name: 'USER_CLIENT',
            HOST: 'localhost',
            PORT: 5011, //@MessagePattern-> users
        }
    }
}

export default config;