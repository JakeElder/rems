import { parse } from "pg-connection-string";
import { ClientConfig } from "pg";
import { ConnectionOptions } from "tls";

export default ({ env }) => {
  const db = parse(env("DATABASE_URL", ""));

  const connectionString = `postgres://${db.user}:${db.password}@${db.host}:${db.port}/${db.database}`;

  const ssl: ConnectionOptions | false = env.bool("DATABASE_SSL")
    ? { rejectUnauthorized: true, ca: env("CA_CERT") }
    : false;

  const connection: ClientConfig = { connectionString, ssl };

  return {
    connection: {
      client: "postgres",
      connection,
      pool: {
        min: env.int("DATABASE_POOL_MIN", 2),
        max: env.int("DATABASE_POOL_MAX", 10)
      },
      acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60000)
    }
  };
};
