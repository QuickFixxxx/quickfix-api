const requiredEnvs = ["PORT", "DATABASE_URL"];

requiredEnvs.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable ${envVar} is missing`);
  }
});

export const environmentVar = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
};
