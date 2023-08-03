export default ({ env }) => {
  const client = env("DATABASE_CLIENT", "postgres");

  const connections = {
    postgres: {
      connection: {
        connectionString: env("DATABASE_URL", "").replace(
          "sslmode=require",
          ""
        ),
        ssl: env.bool("DATABASE_SSL", false) && {
          rejectUnauthorized: true,
          ca: env("CA_CERT")
        },
        schema: env("DATABASE_SCHEMA", "public")
      },
      pool: {
        min: env.int("DATABASE_POOL_MIN", 2),
        max: env.int("DATABASE_POOL_MAX", 10)
      }
    }
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60000)
    }
  };
};
