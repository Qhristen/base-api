export default {
  port: process.env.PORT,
  postgresConfig: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: {
      ca: process.env.POSTGRES_DB_CERT,
    }
  },

  smtp: {
    host: process.env.EMAIL_HOST,
    mailport: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,

  redisUrl: process.env.REDIS_URL,

  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,

  accessTokenPrivateKey: process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY,
  accessTokenPublicKey: process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY,
  refreshTokenPrivateKey: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
  refreshTokenPublicKey: process.env.JWT_REFRESH_TOKEN_PUBLIC_KEY,
};
