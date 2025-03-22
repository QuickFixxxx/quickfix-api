import { Context } from "hono";
import responseHelper from "../../../utils/responsHelpers/responseHelpers";

export const authServices = {
  async loginorRegisterUserService(c: Context) {
    const { phoneNumber } = await c.req.json<{ phoneNumber: string }>();

    return responseHelper.success(c, 200, { phoneNumber });
  },
};
