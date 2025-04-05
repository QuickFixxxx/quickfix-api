import { sign } from "hono/jwt";
import { environmentVar } from "../../config/env";

// generate otp and token functions here

export async function generateOTP() {
  // generate 6 digit number
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
}
export async function generateToken(phoneNumber: string, userId: string) {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const expiry = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days expiration
  const accessPayload = {
    // sub: userId,
    userId,
    phoneNumber,
    type: "access",
    iat: nowInSeconds,
    exp: expiry,
  };

  // const refreshPayload = {
  //   sub: userId,
  //   type: "refresh",
  //   exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365, // 365 days expiration
  // };

  const accessToken = await sign(
    accessPayload,
    environmentVar.JWT_ACCESS_SECRET
  );

  // const refreshToken = await sign(
  //   refreshPayload,
  //   environmentVar.JWT_REFRESH_SECRET
  // );
  return {
    accessToken,
    // refreshToken,
  };
}
