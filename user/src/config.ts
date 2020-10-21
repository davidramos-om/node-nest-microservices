
const config = {
    JWT_SECRETKEY: "DEVEL-024d1f83-683b-4d44-bc29-71a101b2d7fe-APP-AUTH",
    EXPIRESIN: '12h',
    
    ENVIROMENT: 'development',
    LOGGER: false,
    
    PORT: 5010,
    micro: {
        mp: {
            HOST: 'localhost',
            PORT: 5011 //@MessagePattern-> users
        },
        auth: {
            name: 'AUTH_CLIENT',
            HOST: 'localhost',
            PORT: 4011, //@MessagePattern-> auth
        }
    },
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
    }
}

export default config;