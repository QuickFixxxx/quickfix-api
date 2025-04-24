// import { OpenAPIHono } from "@hono/zod-openapi";
// import { authMiddleware } from "../../../middlewares/authMiddleware";
// import { z } from "@hono/zod-openapi";

// type UserPayload = {
//   id: string;
//   phone: string;
// };

// // Extend Hono context to include `user`
// type AppContext = {
//   Variables: {
//     user: UserPayload;
//   };
// };

// // Create a new router instance with extended context
// const protectedRoutes = new OpenAPIHono<AppContext>();

// // Apply auth middleware
// protectedRoutes.use("*", authMiddleware);

// // Protected route
// protectedRoutes.openapi(

//   {
//     method: "get",
//     path: "/protected/user-info",
//     summary: "Get user info",
//     description: "Returns user info from verified token",
//     tags: ["protected"],
//     responses: {
//       200: {
//         description: "User info",
//         content: {
//           "application/json": {
//             schema: z.object({
//               id: z.string(),
//               phone: z.string(),
//             }),
//           },
//         },
//       },
//     },
//   },
//   async (c) => {
//     const user = c.get("user");
//     console.log("User from context:", user); // Add this for debugging
//     return c.json({
//       id: user.id,
//       phone: user.phone
//     });
//     // return c.json(user);
//   }
// );

// export default protectedRoutes;

import { z } from "@hono/zod-openapi";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { OpenAPIHono } from "@hono/zod-openapi";

type UserPayload = {
  id: string;
  phone: string;
};

type AppContext = {
  Variables: {
    user: UserPayload;
  };
};

export const registerProtectedRoutes = (app: OpenAPIHono<AppContext>) => {
  // Middleware
  app.use("/protected/*", authMiddleware);

  // Protected Route
  app.openapi(
    {
      method: "get",
      path: "/protected/user-info",
      summary: "Get user info",
      description: "Returns user info from verified token",
      tags: ["Protected"],

      responses: {
        200: {
          description: "User info",
          content: {
            "application/json": {
              schema: z.object({
                id: z.string(),
                phone: z.string(),
              }),
            },
          },
        },
      },
    },
    async (c) => {
      const user = c.get("user");
      return c.json({
        id: user.id,
        phone: user.phone,
      });
    }
  );
};
