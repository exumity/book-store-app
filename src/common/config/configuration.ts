export interface Configuration {
  postgreUser?: string;
  postgrePass?: string;
  postgreDB?: string;
  postgreHost?: string;
  jwtAccessSecret?: string;
  jwtRefreshSecret?: string;
  jwtAccessTtlInSeconds?: number;
  JwtRefreshTtlInSeconds?: number;
}

export default (): Configuration => ({
  postgrePass: process.env.POSTGRES_PASSWORD,
  postgreUser: process.env.POSTGRES_USER,
  postgreDB: process.env.POSTGRES_DB,
  postgreHost: process.env.POSTGRES_HOST,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessTtlInSeconds: process.env.JWT_ACCESS_TTL_IN_SECONDS
    ? parseInt(process.env.JWT_ACCESS_TTL_IN_SECONDS)
    : undefined,
  JwtRefreshTtlInSeconds: process.env.JWT_REFRESH_TTL_IN_SECONDS
    ? parseInt(process.env.JWT_REFRESH_TTL_IN_SECONDS)
    : undefined,
});
