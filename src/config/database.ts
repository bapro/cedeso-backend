import { Sequelize } from "sequelize-typescript";
import * as dotenv from "dotenv";
import { Incident, Profile, Capture } from "../models";
import { User } from "../models/User"; 
dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME as string,
  username: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  dialect: "mysql",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  models: [Incident, Profile, Capture, User],
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  // FIX: Uncomment SSL for Bluehost
  dialectOptions: {
    connectTimeout: 60000, // 60 seconds timeout
    ssl: {
      rejectUnauthorized: false, // ✅ ENABLE SSL FOR BLUEHOST
    },
  },
  retry: {
    max: 3, // Retry connection up to 3 times
  },
});

// Add connection test with better logging
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connection established successfully");
  })
  .catch((error) => {
    console.error("❌ Database connection failed:");
    console.error("   Error:", error.message);
    console.error("   Code:", error.code);
    console.error("   Host:", process.env.DB_HOST);
    console.error("   Database:", process.env.DB_NAME);
    console.error("   User:", process.env.DB_USER);
  });

export default sequelize;
