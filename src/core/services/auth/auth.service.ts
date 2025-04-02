import { Context } from "hono";
import responseHelper from "../../../utils/responsHelpers/responseHelpers";
import { db } from "../../../config/database";
import { users } from "../../models";
import { createUser, findUserByPhoneNumber } from "../../../functions/user";
import { generateOTP, generateToken } from "../../../functions/secrets";
import redisClient from "../../../config/redis";

export const authServices = {
  async loginorRegisterUserService(c: Context) {
    const { phoneNumber } = await c.req.json<{ phoneNumber: string }>();
    try {
      // check if user exists or not
      const user = await findUserByPhoneNumber(phoneNumber);

      if (!user) {
        // create user
        const newUser = await createUser(phoneNumber);

        // generate otp and store it in redis
        const otp = await generateOTP();
        // const secrets = await generateToken(newUser.id);
        redisClient.set(phoneNumber, otp, "EX", 60 * 10);
        // c.json({ message: "success" });
        return responseHelper.success(c, 200, { user, otp }, "verify otp");
      }
      const otp = await generateOTP();
      redisClient.set(phoneNumber, otp, "EX", 60);

      return responseHelper.success(c, 200, { user, otp });
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      return responseHelper.error(c, 500, message, err);
    }
  },
};
