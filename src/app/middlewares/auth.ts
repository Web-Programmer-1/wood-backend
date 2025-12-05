// import { NextFunction, Request, Response } from "express"
// import { jwtHelper } from "../helper/jwtHelper";
// import ApiError from "../errors/ApiError";
// import httpStatus from "http-status"
// import config from "../../config";
// import { Secret } from "jsonwebtoken";

// const auth = (...roles: string[]) => {
//     return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
//         try {
//             const token = req.cookies.accessToken ;

//             if (!token) {
//                 throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!")
//             }

//             const verifyUser = jwtHelper.verifyToken(token, process.env.JWT_ACCESS_SECRET!);


//             req.user = verifyUser;

//             if (roles.length && !roles.includes(verifyUser.role)) {
//                 throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!")
//             }

//             next();
//         }
//         catch (err) {
//             next(err)
//         }
//     }
// }

// export default auth;















import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status";

const auth = (...roles: UserRole[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.cookies.accessToken;

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "No access token provided");
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
      ) as any;

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden: Access denied");
      }

      next();
    } catch (err: any) {
      next(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          err.message || "Invalid or expired token"
        )
      );
    }
  };
};

export default auth;
