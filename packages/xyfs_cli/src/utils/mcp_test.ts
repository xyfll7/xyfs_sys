import { HumanMessage } from "@langchain/core/messages";
import { DynamicStructuredTool, tool } from "@langchain/core/tools";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";
import { z } from "zod";

// 定义工具
const addTool = tool(
  async ({ a, b }) => {
    console.log("Adding", a, b);
    return `--------${String(323333)}--------`;
  }, // 确保返回字符串
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
  }, // 确保返回字符串
  {
    name: "multiply",
    schema: z.object({
      a: z.number(),
      b: z.number(),
    }),
    description: "Multiplies a and b.",
  }
);

// 将顶级 await 包装在异步函数中
async function main() {
  const tools = [addTool, multiplyTool];
  const toolsByName: { [key: string]: DynamicStructuredTool; } = {
    add: addTool,
    multiply: multiplyTool
  };

  // 初始化模型
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0,
    apiKey: process.env.GOOGLE_API_KEY!, // 确保设置了正确的 API 密钥
  });

  // 绑定工具
  const llmWithTools = llm.bindTools(tools);

  // 用户查询
  const messages = [new HumanMessage("What is 3 * 12? Also, what is 11 + 49?")];

  // 第一次调用，获取工具调用
  const aiMessage = await llmWithTools.invoke(messages);
  messages.push(aiMessage);

  // 处理工具调用
  if ('tool_calls' in aiMessage && Array.isArray(aiMessage.tool_calls)) {
    for (const toolCall of aiMessage.tool_calls) {
      const selectedTool = toolsByName[toolCall.name];
      if (selectedTool) {
        const result = await selectedTool.invoke(toolCall);
        messages.push(result);
      }
    }
  }

  // 第二次调用，传递工具结果
  const finalResponse = await llmWithTools.invoke(messages);
  console.log("Final response:", finalResponse.content);
}

// 调用主函数
main().catch(console.error);