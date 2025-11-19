export default () => ({
  port: process.env?.port,
  database: {
    db_url: process.env.DB_URL as string,
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expire_time: process.env.JWT_EXPIRE_TIME as any,
  },
});
