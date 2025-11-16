
export default () => ({
  port: process.env?.port,
  database: {
   db_url:process.env.DB_URL as string
  }
});
