import Config from "./config/custom-environment-variables";
export default {
  type: "postgres",
  database: Config.postgresConfig.database,
  password: String(Config.postgresConfig.password),
  host: Config.postgresConfig.host,
  username: Config.postgresConfig.username,
  port: Number(Config.postgresConfig.port),
  synchronize: true,
  logging: false,
  entities: ["src/Entities/**/*.entity{.ts,.js}"],
  seeds: ["src/Seeds/*.seeder.ts"],
  factories: ["src/Seeds/factory/*.factory.ts"],
};
