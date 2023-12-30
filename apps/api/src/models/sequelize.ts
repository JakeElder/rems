require("events").EventEmitter.defaultMaxListeners = 15;

import { Sequelize } from "sequelize";
import * as pg from "pg";
import { parse } from "pg-connection-string";
import { ConnectionOptions } from "tls";

const db = parse(process.env.DATABASE_URL!);

const ssl: ConnectionOptions | false = process.env.VERCEL_ENV
  ? { rejectUnauthorized: true, ca: process.env.DATABASE_CA_CERT }
  : false;

const dialectOptions: pg.ClientConfig = { ssl };

export default new Sequelize(
  `postgres://${db.user}:${db.password}@${db.host}:${db.port}/${db.database}`,
  {
    dialectModule: pg,
    dialectOptions,
    logging: false,
    pool: { max: 14, min: 0 }
  }
);
