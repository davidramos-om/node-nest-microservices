import { getConnection, getConnectionOptions } from 'typeorm';
import config from '../../config';

export const DbConnectionOptions = async (connectionName: string = 'default') =>
{
    const options = await getConnectionOptions(connectionName)
    return {
        ...options,
        name: connectionName,
    };
};

export const getDbConnection = async (connectionName: string = 'default') =>
{
    return await getConnection(connectionName);
};

export const runDbMigrations = async (connectionName: string = 'default') =>
{
    const conn = await getDbConnection(connectionName);
    await conn.runMigrations();
};