// src/routes/users.ts
import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router({ mergeParams: true }); // Add mergeParams

console.log("🎯 User routes file is executing NOW!");

// Debug middleware
router.use((req, res, next) => {
  console.log(`🎯 User router received: ${req.method} ${req.originalUrl}`);
  console.log(`🎯 User router base: ${req.baseUrl}`);
  console.log(`🎯 User router path: ${req.path}`);
  next();
});

// Test route
router.get("/user-test-unique", (req, res) => {
  console.log("🎯 /user-test-unique route handler executed!");
  res.json({
    message: "User routes are working!",
    timestamp: new Date().toISOString(),
  });
});

// Your actual routes
router.post("/send-verification", UserController.sendVerificationCode);
router.post("/verify-code", UserController.verifyCode);

console.log("🎯 User router setup complete");

export default router;
