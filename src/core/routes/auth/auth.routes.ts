import { OpenAPIHono } from "@hono/zod-openapi";
import {
  loginOrRegisterRoute,
  verifyOtpRoute,
} from "../../../docs/auth/auth.docs";
import { authServices } from "../../services/auth/auth.service";

const authRoutes = new OpenAPIHono();

authRoutes.openapi(
  loginOrRegisterRoute,
  authServices.loginorRegisterUserService
);
authRoutes.openapi(verifyOtpRoute, authServices.verifyOtpService);

export default authRoutes;
