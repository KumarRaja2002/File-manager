import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres'; 
import configData from '../../config/appConfig';

const pool = new Pool({
    user: configData.db.dbUser,
    password: configData.db.dbPassword,
    host: configData.db.dbHost,
    port: Number(configData.db.dbPort),
    database: configData.db.dbName,
    ssl: {
        rejectUnauthorized: true,
        ca: configData.db.dbCa,
    },
});

export const db = drizzle(pool);
