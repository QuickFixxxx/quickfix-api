import { OpenAPIHono } from "@hono/zod-openapi";

class ProtectedOpenAPIHono extends OpenAPIHono {
  constructor() {
    super();
    this.openAPIRegistry.registerComponent("securitySchemes", "BearerAuth", {
      type: "http",
      scheme: "bearer",
      description: "Enter token in the format: **Bearer <token>**",
    });
  }
}

export default ProtectedOpenAPIHono;
