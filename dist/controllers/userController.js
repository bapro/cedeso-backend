"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_1 = require("../models/User");
const emailService_1 = require("../services/emailService");
class UserController {
    // Send verification code
    static async sendVerificationCode(req, res) {
        try {
            const { fullName, email } = req.body;
            if (!fullName || !email) {
                return res.status(400).json({
                    success: false,
                    message: "Full name and email are required",
                });
            }
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a valid email address",
                });
            }
            // Generate 6-digit code
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
            // Check if user already exists
            let user = await User_1.User.findOne({ where: { email } });
            if (user) {
                // Update existing user with new verification code
                await user.update({
                    fullName,
                    verificationCode,
                    verificationCodeExpires,
                    isVerified: false,
                });
            }
            else {
                // Create new user
                user = await User_1.User.create({
                    fullName,
                    email,
                    verificationCode,
                    verificationCodeExpires,
                });
            }
            // Send verification email
            const emailSent = await (0, emailService_1.sendVerificationCode)(email, verificationCode);
            if (!emailSent) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to send verification email",
                });
            }
            res.json({
                success: true,
                message: "Verification code sent to your email",
                email: email, // Return email for frontend reference
            });
        }
        catch (error) {
            console.error("Error in sendVerificationCode:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }
    // Verify code
    static async verifyCode(req, res) {
        try {
            const { email, code } = req.body;
            if (!email || !code) {
                return res.status(400).json({
                    success: false,
                    message: "Email and verification code are required",
                });
            }
            const user = await User_1.User.findOne({
                where: { email },
            });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }
            // Check if code matches and is not expired
            if (user.verificationCode !== code) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid verification code",
                });
            }
            if (user.verificationCodeExpires &&
                new Date() > user.verificationCodeExpires) {
                return res.status(400).json({
                    success: false,
                    message: "Verification code has expired",
                });
            }
            // Mark user as verified
            await user.update({
                isVerified: true,
                verificationCode: null,
                verificationCodeExpires: null,
            });
            res.json({
                success: true,
                message: "Email verified successfully",
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                },
            });
        }
        catch (error) {
            console.error("Error in verifyCode:", error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }
}
exports.UserController = UserController;
// import { Request, Response } from "express";
// console.log("🎯 UserController is loading!");
// export class UserController {
//   static async sendVerificationCode(req: Request, res: Response) {
//     try {
//       const { fullName, email } = req.body;
//       console.log("Send verification called:", { fullName, email });
//       res.json({ success: true, message: "Verification code sent" });
//     } catch (error) {
//       res.status(500).json({ success: false, message: "Error" });
//     }
//   }
//   static async verifyCode(req: Request, res: Response) {
//     try {
//       const { email, code } = req.body;
//       console.log("Verify code called:", { email, code });
//       res.json({ success: true, message: "Code verified" });
//     } catch (error) {
//       res.status(500).json({ success: false, message: "Error" });
//     }
//   }
// }
