import { UserStatus } from "@prisma/client"
import { prisma } from "../../shared/prisma"
import bcrypt from "bcryptjs";
import { Secret } from 'jsonwebtoken'
import { jwtHelper } from "../../helper/jwtHelper";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status"
import config from "../../../config";
import emailSender from "./emailSender";


interface ResetPasswordPayload {
  userId: string;       // from frontend
  newPassword: string;  // from frontend
}

const login = async (payload: { email: string, password: string }) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })

    const isCorrectPassword = await bcrypt.compare(payload.password, user.password);
    if (!isCorrectPassword) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Password is incorrect!")
    }

    const accessToken = jwtHelper.generateToken({ email: user.email, role: user.role }, config.jwt.jwt_secret as Secret, "1h");

    const refreshToken = jwtHelper.generateToken({ email: user.email, role: user.role }, config.jwt.refresh_token_secret as Secret, "90d");

    return {
        accessToken,
        refreshToken,
        needPasswordChange: user.needPasswordChange
    }
}

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelper.verifyToken(token, config.jwt.refresh_token_secret as Secret);
    }
    catch (err) {
        throw new Error("You are not authorized!")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    });

    const accessToken = jwtHelper.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    };

};

const changePassword = async (user: any, payload: any) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!")
    }

    const hashedPassword: string = await bcrypt.hash(payload.newPassword, Number(config.salt_round));

    await prisma.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    })

    return {
        message: "Password changed successfully!"
    }
};

const forgotPassword = async (payload: { email: string }) => {
  if (!payload.email) {
    throw new Error("Email is required!");
  }

  // Only 'email' allowed in findUnique()
  const userData = await prisma.user.findUniqueOrThrow({
    where: { email: payload.email },
  });

  if (userData.status !== UserStatus.ACTIVE) {
    throw new Error("User is not active!");
  }

  // Generate reset token
  const resetPassToken = jwtHelper.generateToken(
    { email: userData.email, role: userData.role },
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_token_expires_in as string
  );

  // Construct link
  const resetPassLink = `${config.reset_pass_link}?userId=${userData.id}&token=${resetPassToken}`;

  // Send email
  await emailSender(
    userData.email,
    `
    <div style="font-family:sans-serif;line-height:1.5">
      <p>Dear ${userData.email || "User"},</p>
      <p>You requested a password reset. Please click below:</p>
      <p>
        <a href="${resetPassLink}" 
           style="background-color:#008E48;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">
           Reset Password
        </a>
      </p>
      <p>If you did not request this, you can ignore this email.</p>
      <p>— PH Health Care Team</p>
    </div>
    `
  );

  return { message: "Password reset link sent to your email!" };
};


const resetPassword = async (token: string, payload: ResetPasswordPayload) => {
  if (!payload.userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required!");
  }
  if (!payload.newPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "New password is required!");
  }

  // 2️ Fetch user by ID
  const user = await prisma.user.findUniqueOrThrow({ where: { id: payload.userId } });

  if (user.status !== UserStatus.ACTIVE) {
    throw new ApiError(httpStatus.FORBIDDEN, "User is not active!");
  }

  // 3️ Hash new password
  const hashedPassword = await bcrypt.hash(payload.newPassword, Number(config.salt_round));

  // 4️ Update password
  await prisma.user.update({
    where: { id: payload.userId },
    data: { password: hashedPassword },
  });

  return { message: "Password reset successfully!" };
};



const getMe = async (session: any) => {
    const accessToken = session.accessToken;
    const decodedData = jwtHelper.verifyToken(accessToken, config.jwt.jwt_secret as Secret);

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    })

    const { id, email, role, needPasswordChange, status } = userData;

    return {
        id,
        email,
        role,
        needPasswordChange,
        status
    }

}

export const AuthService = {
    login,
    changePassword,
    forgotPassword,
    refreshToken,
    resetPassword,
    getMe
}