// // src/controllers/userController.ts
import { Request, Response } from "express";
import { User } from "../models/User";
import { sendVerificationCode } from "../services/emailService";

export class UserController {
  // Send verification code
  static async sendVerificationCode(req: Request, res: Response) {
    try {
      console.log("🎯 sendVerificationCode controller called!");
      console.log("📦 Request body:", req.body);

      const { fullName, email } = req.body;

      if (!fullName || !email) {
        console.log("❌ Missing fullName or email");
        return res.status(400).json({
          success: false,
          message: "Full name and email are required",
        });
      }

      console.log(`👤 Processing user: ${fullName}, ${email}`);

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        console.log("❌ Invalid email format");
        return res.status(400).json({
          success: false,
          message: "Please provide a valid email address",
        });
      }

      // Generate 6-digit code
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      console.log(`🔐 Generated code: ${verificationCode}`);

      // Check if user already exists
      let user = await User.findOne({ where: { email } });
      console.log(`👤 User found in DB: ${!!user}`);

      if (user) {
        // Update existing user with new verification code
        console.log("🔄 Updating existing user");
        await user.update({
          fullName,
          verificationCode,
          verificationCodeExpires,
          isVerified: false,
        });
      } else {
        // Create new user
        console.log("🆕 Creating new user");
        user = await User.create({
          fullName,
          email,
          verificationCode,
          verificationCodeExpires,
        });
      }

      console.log("📧 Calling sendVerificationCode service...");
      // Send verification email
      const emailSent = await sendVerificationCode(email, verificationCode);

      if (!emailSent) {
        console.log("❌ Email service returned false");
        return res.status(500).json({
          success: false,
          message: "Failed to send verification email",
        });
      }

      console.log("✅ Verification process completed successfully");
      res.json({
        success: true,
        message: "Verification code sent to your email",
        email: email,
      });
    } catch (error) {
      console.error("💥 Error in sendVerificationCode:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  // Verify code
  static async verifyCode(req: Request, res: Response) {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        return res.status(400).json({
          success: false,
          message: "Email and verification code are required",
        });
      }

      const user = await User.findOne({
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

      if (
        user.verificationCodeExpires &&
        new Date() > user.verificationCodeExpires
      ) {
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
    } catch (error) {
      console.error("Error in verifyCode:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

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
