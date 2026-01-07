import { serverEnv } from "./config/env.server";
import OpenAI from "openai";

if (!serverEnv.OPENAI_API_KEY) {
  throw new Error(
    "OPENAI_API_KEY is not set. Check your environment configuration."
  );
}
export const openai = new OpenAI({
  apiKey: serverEnv.OPENAI_API_KEY,
});
