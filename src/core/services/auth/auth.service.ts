import { Context } from "hono";
import responseHelper from "../../../utils/responsHelpers/responseHelpers";
import { createUser, findUserByPhoneNumber } from "../../../functions/user";
import { generateOTP, generateToken } from "../../../functions/secrets";
import redisClient from "../../../config/redis";
import { otpQueue } from "../../../config/queue";

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

        // await otpQueue.add("sendOtp", { phoneNumber, otp });

        // c.json({ message: "success" });
        return responseHelper.success(
          c,
          201,
          { user: newUser, otp },
          "verify otp"
        );
      }
      const otp = await generateOTP();
      await redisClient.set(phoneNumber, otp, "EX", 60 * 10);
      // await otpQueue.add("sendOtp", { phoneNumber, otp });
      return responseHelper.success(c, 200, { user, otp });
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      return responseHelper.error(c, 500, message, err);
    }
  },
  async verifyOtpService(c: Context) {
    const { phoneNumber, otp } = await c.req.json();
    try {
      const user = await findUserByPhoneNumber(phoneNumber);
      if (user) {
        const redisOtp = await redisClient.get(phoneNumber);
        if (otp == redisOtp) {
          const secrets = await generateToken(phoneNumber, user.id);
          const { accessToken } = secrets;
          await redisClient.set(user.id, accessToken);
          await redisClient.del(phoneNumber);
          return responseHelper.success(
            c,
            200,
            { user, accessToken },
            "login success"
          );
        } else {
          return responseHelper.error(c, 401, "invalid otp");
        }
      } else {
        return responseHelper.error(c, 404, "user not found");
      }
    } catch (err) {
      console.error("err", err);
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      return responseHelper.error(c, 500, message, err);
    }
  },
};
