import { Model } from "sequelize-typescript";
export declare class User extends Model {
    id: number;
    fullName: string;
    email: string;
    isVerified: boolean;
    verificationCode: string;
    verificationCodeExpires: Date;
    createdAt: Date;
    updatedAt: Date;
}
