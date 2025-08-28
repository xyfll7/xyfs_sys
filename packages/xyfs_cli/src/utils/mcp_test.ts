import { ChatOpenAI } from "@langchain/openai";
import 'dotenv/config';
import { z } from "zod";

console.log("Testing MCP Client...", process.env.DASHSCOPE_API_KEY);
const model = new ChatOpenAI({
  model: "qwen-plus-latest",
  apiKey: process.env.DASHSCOPE_API_KEY!,
  temperature: 0,
  configuration: {
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  },
  modelKwargs: {
    max_tokens: 1500,
    type: "json_object"
  }
});


await test_1();


async function test_1() {
  const res = await model.invoke(`attractions`);
  console.log("Joke:", res.content);
}


async function test_0() {
  const joke = z.object({
    setup: z.string().describe("The setup of the joke"),
    punchline: z.string().describe("The punchline to the joke"),
    rating: z.number().describe("How funny the joke is, from 1 to 10"),
  });

  const structuredLlm = model.withStructuredOutput(joke, {
    method: "json_object",
    name: "joke"
  });


  const res = await structuredLlm.invoke(`Tell me a joke about cats.`);

  console.log("Joke:", res.setup, res.punchline, "Rating:", res.rating);
}

