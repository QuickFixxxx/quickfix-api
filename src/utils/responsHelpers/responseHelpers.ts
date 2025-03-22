import { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";

type JsonResponse<T = any> = {
  status: number;
  success: boolean;
  message: string;
  data?: T | null;
  pagination?: object | null;
  error?: string | null;
};

const responseHelper = {
  success<T>(
    c: Context,
    status: ContentfulStatusCode = 200,
    data: T | null = null,
    message: string = "Success"
  ) {
    return c.json<JsonResponse<T>>(
      {
        status,
        success: true,
        message,
        data,
        pagination: null,
        error: null,
      },
      status
    );
  },

  error(
    c: Context,
    status: ContentfulStatusCode = 500,
    message: string = "Error",
    error: unknown = null
  ) {
    return c.json<JsonResponse>(
      {
        status,
        success: false,
        message,
        data: null,
        pagination: null,
        error: error ? String(error) : null,
      },
      status
    );
  },

  paginated<T>(
    c: Context,
    status: ContentfulStatusCode = 200,
    data: T[] = [],
    pagination: object = {},
    message: string = "Success"
  ) {
    return c.json<JsonResponse<T[]>>(
      {
        status,
        success: true,
        message,
        data,
        pagination,
        error: null,
      },
      status
    );
  },
};

export default responseHelper;
