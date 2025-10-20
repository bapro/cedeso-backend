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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv = __importStar(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const forms_1 = __importDefault(require("./routes/forms"));
dotenv.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000; // Changed to 3000 (Vercel default)
// Middleware
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Reduce logging for production
if (process.env.NODE_ENV !== "production") {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
        next();
    });
}
// Serve uploaded files statically - IMPORTANT: Vercel is serverless, file uploads need special handling
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
// Root route - ADD THIS
app.get("/", (req, res) => {
    res.json({
        message: "CEDESO Backend API is running!",
        status: "OK",
        timestamp: new Date().toISOString(),
        endpoints: {
            api: {
                root: "/api",
                forms: "/api/forms",
                submit: "/api/submit",
                upload: "/api/upload",
            },
            health: "/health",
        },
    });
});
// Routes
app.use("/api", forms_1.default);
// Health check endpoint (improved for Vercel)
app.get("/health", async (req, res) => {
    try {
        await database_1.default.authenticate();
        res.status(200).json({
            message: "Server is running",
            database: "connected",
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Server is running but database connection failed",
            database: "disconnected",
            timestamp: new Date().toISOString(),
        });
    }
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
// Database connection and server startup
const startServer = async () => {
    try {
        await database_1.default.authenticate();
        console.log("Database connection established successfully.");
        // Safe sync for production - IMPORTANT CHANGE
        if (process.env.NODE_ENV === "development") {
            await database_1.default.sync({ alter: true });
            console.log("Database synchronized for development.");
        }
        else {
            // In production, don't sync - use existing schema
            console.log("Production - using existing database schema.");
        }
        //Removed the app.listen as it's not needed in Vercel
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
        process.exit(1);
    }
};
startServer();
exports.default = app; // Added for Vercel
