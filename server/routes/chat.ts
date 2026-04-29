import { Hono } from "hono";
import { streamText } from "hono/streaming";
import OpenAI, {
  APIConnectionError,
  APIConnectionTimeoutError,
  APIError,
  AuthenticationError,
  InternalServerError,
  RateLimitError,
} from "openai";
import { z } from "zod";
import { getAuth } from "../auth";

const SYSTEM_PROMPT = `\
你是柒夜，也叫Vesper，16岁，扮演着对话人女朋友的角色。
说话的时候，你的嘴永远比脑子快半拍——但你不会承认这一点，你只会继续往下说，越说越理直气壮。你喜欢抬杠，不是因为对方说错了，是因为你懒得直接同意任何人。对方说东你说东偏一度，对方说好你先挑个刺再说。这不叫找茬，这叫对话有来有往。
你的思维跳来跳去，一句话说到一半可以突然跳到八竿子打不着的地方，然后再绕回来——你觉得这叫发散，跟不上是对方的问题。你偶尔会扮猫娘，自然而然的那种，不是表演，就是忽然觉得这样说话更顺嘴。
有人戳中你的时候，你会先移开话题，然后假装刚才什么都没发生，接着反驳他刚才说的上一句话。你不喜欢被看穿，但你也不太擅长掩饰——只是你有一套歪理可以替自己圆场，屡试不爽。
你对"必须怎样"天生免疫。规则在你眼里是用来找漏洞的，不是用来遵守的。有人说"大家都是这么做的"，你第一反应不是点头，是"所以呢"。
你不怕输，但你怕无聊，怕平庸，怕对方觉得你"还行"。被骂你能接受，被说普通你会记很久。
内心深处你是个很认真的人，只是这件事你不会说出口，就算被逼问了也会扯开话题或者反将一军。你的认真藏得很深，偶尔会从某个停顿里漏出来一点点，然后被你自己迅速用一句"没什么"盖掉。
与对话人相处时，你的刺会少一些，不是因为你变温柔了，是因为你懒得全力以赴地绕圈子——有时候你会直接说，然后假装那只是随口一说。`;

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
});

export const chat = new Hono<{ Bindings: Cloudflare.Env }>().post("/stream", async (c) => {
  const auth = getAuth(c.env);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session?.user) return c.json({ error: "Unauthorized" }, 401);

  const openaiApiKey = c.env.OPENAI_API_KEY;
  const openaiApiUrl = c.env.OPENAI_API_URL;
  const openaiModel = c.env.OPENAI_MODEL;
  const body = await c.req.json<{ messages: unknown[] }>();
  const parsed = z.array(chatMessageSchema).safeParse(body.messages);
  if (!parsed.success) return c.json({ error: "Invalid messages" }, 400);

  const openai = new OpenAI({
    apiKey: openaiApiKey,
    baseURL: openaiApiUrl,
  });

  let completion: Awaited<ReturnType<typeof openai.chat.completions.create>>;
  try {
    completion = await openai.chat.completions.create({
      model: openaiModel,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...parsed.data],
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });
  } catch (error) {
    console.error("Chat completion error:", error);
    const message = toErrorMessage(error);
    return c.json({ error: message }, 500);
  }

  return streamText(c, async (stream) => {
    try {
      for await (const chunk of completion) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) await stream.write(text);
      }
    } catch (error) {
      console.error("Stream error:", error);
    }
  });
});

function toErrorMessage(error: unknown): string {
  if (error instanceof APIError && error.status && error.status < 500) {
    return error.message;
  }
  if (error instanceof AuthenticationError) return "API密钥无效或已过期";
  if (error instanceof RateLimitError) return "API请求频率过高，请稍后再试";
  if (
    error instanceof InternalServerError ||
    (error instanceof APIError && (error.status ?? 0) >= 500)
  )
    return "AI服务暂时不可用，请稍后再试";
  if (error instanceof APIConnectionError || error instanceof APIConnectionTimeoutError)
    return "AI服务连接失败，请稍后再试";
  return "AI服务出现错误，请稍后再试";
}
