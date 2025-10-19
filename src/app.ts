import "reflect-metadata";
import express from "express";
import cors from "cors";
import path from "path";
import * as dotenv from "dotenv";
import sequelize from "./config/database";

import formRoutes from "./routes/forms";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // Changed to 3000 (Vercel default)

// Middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Reduce logging for production
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
}

// Serve uploaded files statically - IMPORTANT: Vercel is serverless, file uploads need special handling
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", formRoutes);

// Health check endpoint (improved for Vercel)
app.get("/health", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.status(200).json({
      message: "Server is running",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Server is running but database connection failed",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  }
);

// 404 handler
app.use((req: express.Request, res: express.Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Database connection and server startup
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    // Safe sync for production - IMPORTANT CHANGE
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("Database synchronized for development.");
    } else {
      // In production, don't sync - use existing schema
      console.log("Production - using existing database schema.");
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

startServer();

export default app; // Added for Vercel
