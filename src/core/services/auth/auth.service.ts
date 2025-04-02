import { Context } from "hono";
import responseHelper from "../../../utils/responsHelpers/responseHelpers";
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
        redisClient.set(newUser.id, otp, "EX", 60 * 10);
        // c.json({ message: "success" });
        return responseHelper.success(
          c,
          201,
          { user: newUser, otp },
          "verify otp"
        );
      }
      const otp = await generateOTP();
      await redisClient.set(user.id, otp, "EX", 60 * 10);
      return responseHelper.success(c, 200, { user, otp });
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      return responseHelper.error(c, 500, message, err);
    }
  },
  async verifyOtpService(c: Context) {
    const { userId, otp } = await c.req.json();
    try {
      const redisOtp = await redisClient.get(userId);
      if (otp == redisOtp) {
        const secrets = await generateToken(userId);
        await redisClient.del(userId);
        return responseHelper.success(
          c,
          200,
          { userId, secrets },
          "login success"
        );
      }
      return responseHelper.error(c, 402, "invalid otp");
    } catch (err) {
      console.error("err", err);
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      return responseHelper.error(c, 500, message, err);
    }
  },
};
