import { ADAPTER } from "src/common/enums";

const config = {
    SECRETKEY: "DEVEL-024d1f83-683b-4d44-bc29-71a101b2d7fe-APP",
    EXPIRESIN: 86400,
    PORT: 6010,
    ENVIROMENT: 'development',
    APP_ADAPTER: ADAPTER.FASTITY,
    LOGGER: false,
    GEN_DOCS: true,
    micro: {
        mp: {
            HOST: 'localhost',
            PORT: 6011 //@MessagePattern-> community
        },
        auth: {
            name: 'AUTH_CLIENT',
            HOST: 'localhost',
            PORT: 4011, //@MessagePattern-> auth
        }
    },
    db: {
        core: {
            name: 'core',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'rf3t46qjgw',
            database: 'monument',
            synchronize: false,
            logging: true,
        }
    }
}

export default config;