import "mysql2"; // ✅ Forces Vercel to include mysql2
import "reflect-metadata";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import sequelize from "./config/database";
import formRoutes from "./routes/forms";
import userRoutes from "./routes/users";
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
      },
      health: "/health",
    },
  });
});

// Routes
app.use("/api/users", userRoutes); 
app.use("/api", formRoutes);

// Health check endpoint (improved for Vercel)
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
    // Return 200 but indicate DB is disconnected
    res.status(200).json({
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
  console.log(
    `Starting CEDESO backend in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
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

    // ✅ ADD THIS BACK - Vercel needs the server to be listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    // Don't exit in production - let the server start without DB
    console.log("Starting server without database connection...");

    // ✅ ADD THIS BACK - Start server even if DB fails
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} (without database)`);
    });
  }
};

startServer();

export default app; // Added for Vercel
