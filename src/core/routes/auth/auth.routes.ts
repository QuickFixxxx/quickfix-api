import { OpenAPIHono } from "@hono/zod-openapi";
import { loginOrRegisterRoute } from "../../../docs/auth/auth.docs";
import { authServices } from "../../services/auth/auth.service";
import redisClient from "../../../config/redis";

const authRoutes = new OpenAPIHono();

authRoutes.openapi(
  loginOrRegisterRoute,
  authServices.loginorRegisterUserService
);

export default authRoutes;
