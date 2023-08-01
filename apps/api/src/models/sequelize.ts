import { Sequelize } from "sequelize";
import * as pg from "pg";

export default new Sequelize(process.env.DATABASE_URL!, {
  dialectModule: pg,
  dialectOptions: {
    ssl: process.env.DATABASE_SSL
      ? { require: true, rejectUnauthorized: false }
      : null
  },
  logging: false
});
