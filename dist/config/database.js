"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv = __importStar(require("dotenv"));
const models_1 = require("../models");
dotenv.config();
const sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    models: [models_1.Incident, models_1.Profile, models_1.Capture],
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
exports.default = sequelize;
