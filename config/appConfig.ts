import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// set up data
const appData = {
    api_version: "v1.0",
    port : Number(process.env.PORT) || 3000,
};

const db = {
    dbUser:String(process.env.DB_USER),
    dbName:String(process.env.DB_NAME),
    dbUrl:String(process.env.DB_URL),
    dbPassword:String(process.env.DB_PASSWORD),
    dbHost:String(process.env.DB_HOST),
    dbPort:Number(process.env.DB_PORT),
    dbCa: process.env.DB_CA
}

const JWTData = {
    token_secret: "DRXqa9r4UsjO5F0wMybN2BdTiKGmzAoLs82jjj#wsjld",
    token_life: 7890000,
    refresh_token_secret: "wXyjKsdjlj#12ZpuoDsmg1MLP8CaHkfO2bUhrF6W",
    refresh_token_life: 15780000,
    key: process.env.DEVICE_APP_KEY,

};

const s3 = {
    s3_bucket: process.env.AWS_S3_BUCKET!,
    bucket_region: process.env.AWS_S3_BUCKET_REGION!,
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
    expires: 3600
}


const configData = {
    app: appData,
    jwt: JWTData,
    db: db,
    s3: s3
};



export default configData;  
