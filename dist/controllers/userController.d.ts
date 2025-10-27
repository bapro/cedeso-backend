import { Request, Response } from "express";
export declare class UserController {
    static sendVerificationCode(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static verifyCode(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
