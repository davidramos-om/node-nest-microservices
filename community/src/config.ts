import { ADAPTER } from "src/common/enums";

const config = {
    SECRETKEY: "DEVEL-024d1f83-683b-4d44-bc29-71a101b2d7fe-APP",
    EXPIRESIN: 86400,
    PORT: 4002,
    ENVIROMENT: 'development',
    APP_ADAPTER: ADAPTER.FASTITY,
    LOGGER: false,
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