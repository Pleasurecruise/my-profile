import { defineHandler } from "void/handler";
import { generateOgImageResponse } from "@server/lib/og";

export const GET = defineHandler(() => generateOgImageResponse({ type: "home" }));
