import { Sequelize } from "sequelize-typescript";
import * as dotenv from "dotenv";
import { Incident, Profile, Capture } from "../models";

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME as string,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  dialect: "mysql",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  models: [Incident, Profile, Capture],
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  // Add these for better production performance
  dialectOptions:
    process.env.NODE_ENV === "production"
      ? {
          connectTimeout: 60000, // 60 seconds timeout
          // If your Bluehost requires SSL, add:
          // ssl: {
          //   rejectUnauthorized: false
          // }
        }
      : {},
  retry: {
    max: 3, // Retry connection up to 3 times
  },
});

export default sequelize;
