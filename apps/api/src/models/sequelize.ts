import { Sequelize } from "sequelize";
import * as pg from "pg";

const dialectOptions = {
  ssl: process.env.DATABASE_SSL
    ? {
      rejectUnauthorized: true,
      ca: process.env.DATABASE_CA_CERT
    }
    : null
};

export default new Sequelize(process.env.DATABASE_URL!, {
  dialectModule: pg,
  dialectOptions,
  logging: false
});
