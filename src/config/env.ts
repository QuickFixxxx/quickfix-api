// Define the type for environment variables
type EnvironmentVariables = {
  PORT: string;
  DATABASE_URL: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_USERNAME: string;
  REDIS_PASSWORD: string;
  JWT_REFRESH_SECRET: string;
  JWT_ACCESS_SECRET: string;
};

const requiredEnvs: Array<keyof EnvironmentVariables> = [
  "PORT",
  "DATABASE_URL",
  "REDIS_HOST",
  "REDIS_PORT",
  "JWT_REFRESH_SECRET",
  "JWT_ACCESS_SECRET",
];

requiredEnvs.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable ${envVar} is missing`);
  }
});

export const environmentVar: EnvironmentVariables = {
  PORT: process.env.PORT!,
  DATABASE_URL: process.env.DATABASE_URL!,
  REDIS_HOST: process.env.REDIS_HOST!,
  REDIS_PORT: process.env.REDIS_PORT!,
  REDIS_USERNAME: process.env.REDIS_USERNAME!,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
};
