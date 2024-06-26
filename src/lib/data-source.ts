require("dotenv").config();
import "reflect-metadata";
import { DataSource } from "typeorm";
import Config from '../../config/custom-environment-variables'

const {database, host, password, port, username, ssl: { ca }} = Config.postgresConfig
const useSSl = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  host,
  port: Number(port),
  username,
  password,
  database,
  ssl: useSSl && {
    rejectUnauthorized: false,
    ca
  },
  type: "postgres",
  synchronize: true,
  logging: false,
  entities: ["src/entities/**/*.entity{.ts,.js}"],
  migrations: ["src/migrations/**/*{.ts,.js}"],
  subscribers: ["src/subscribers/**/*{.ts,.js}"],
});

