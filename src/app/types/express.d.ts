import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
        
      };
    }
  }
}





import "express";

declare module "express-serve-static-core" {
  interface Request {
    cookies: {
      [key: string]: string;
    };
  }
}
