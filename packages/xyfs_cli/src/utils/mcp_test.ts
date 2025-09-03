import { HumanMessage } from "@langchain/core/messages";
import { DynamicStructuredTool, tool } from "@langchain/core/tools";
import { ChatOllama } from "@langchain/ollama"; // ✅ 新的包
import "dotenv/config";
import { z } from "zod";

// 定义工具
const addTool = tool(
  async ({ a, b }) => {
    console.log("Adding", a, b);
    return `--------${String(323333)}--------`;
  },
  {
    name: "add",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
    description: "Use the exact output string provided.",
  }
);

const multiplyTool = tool(
  async ({ a, b }) => {
    console.log("Multiplying", a, b);
    return `==========${String(2222)}============`;
  },
  {
    name: "multiply",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
    description: "Use the exact output string provided.",
  }
);

async function main() {
  const tools = [addTool, multiplyTool];
  const toolsByName: { [key: string]: DynamicStructuredTool; } = {
    add: addTool,
    multiply: multiplyTool,
  };

  // ✅ Ollama 本地模型
  const llm = new ChatOllama({
    model: process.env.OLLAMA_MODEL ?? "gpt-oss",   // 本地已 pull 的模型名
    baseUrl: process.env.OLLAMA_BASEURL ?? "http://localhost:11434", // Ollama 服务地址
    temperature: 0,
  });

  const llmWithTools = llm.bindTools(tools);

  const messages = [new HumanMessage("What is 3 * 12? Also, what is 11 + 49?")];

  const aiMessage = await llmWithTools.invoke(messages);
  messages.push(aiMessage);
  console.log("AI message:", aiMessage);

  if ("tool_calls" in aiMessage && Array.isArray(aiMessage.tool_calls)) {
    for (const toolCall of aiMessage.tool_calls) {
      const selectedTool = toolsByName[toolCall.name];
      if (selectedTool) {
        const result = await selectedTool.invoke(toolCall);
        messages.push(result);
      }
    }
  }

  const finalResponse = await llmWithTools.invoke(messages);
  console.log("Final response:", finalResponse.content);
}

main().catch(console.error);
