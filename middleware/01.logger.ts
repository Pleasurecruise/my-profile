import { logger } from "hono/logger";
import { defineMiddleware } from "void/handler";

export default defineMiddleware(logger());
