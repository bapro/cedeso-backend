"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/users.ts
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)({ mergeParams: true }); // Add mergeParams
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
router.post("/send-verification", userController_1.UserController.sendVerificationCode);
router.post("/verify-code", userController_1.UserController.verifyCode);
console.log("🎯 User router setup complete");
exports.default = router;
