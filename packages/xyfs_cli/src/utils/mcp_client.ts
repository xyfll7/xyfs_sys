// mcp_client.ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import OpenAI from "openai";

// 千问 API 调用函数
async function callQwenAPI(prompt: string) {
  // 注意：你需要设置 Qwen API Key
  const apiKey = "sk-3ab003e0b90346e58d4072f402a15b13"; // process.env.QWEN_API_KEY;
  if (!apiKey) {
    throw new Error("请设置 QWEN_API_KEY 环境变量");
  }
  
  try {
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
    });

    const response = await openai.chat.completions.create({
      model: "qwen-plus",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.8,
      top_p: 0.8
    });

    // 添加检查确保响应内容存在
    if (response.choices && response.choices.length > 0) {
      const choice = response.choices[0];
      if (choice && choice.message && choice.message.content) {
        return choice.message.content;
      } else {
        throw new Error("Qwen API 返回的响应中没有内容");
      }
    } else {
      throw new Error("Qwen API 返回的响应中没有选择项");
    }
  } catch (error) {
    console.error("Error in callQwenAPI:", error);
    throw error;
  }
}

async function runMCPClient() {
  try {
    // 1. 创建客户端 transport (基于子进程的 stdio)
    // 使用 StdioClientTransport 直接启动子进程
    const transport = new StdioClientTransport({
      command: "npx",
      args: ["tsx", "src/utils/mcp_server.ts"]
    });

    // 2. 创建 MCP 客户端
    const client = new Client(
      {
        name: "my-first-mcp-client",
        version: "1.0.0",
      },
      {
        capabilities: {}, // 客户端能力声明，这里可以留空
      }
    );

    // 3. 连接客户端和服务端
    await client.connect(transport);
    console.log("✅ MCP Client connected!");

    // 4. 请求列出工具
    const toolList = await client.listTools();
    console.log("工具列表:", toolList);

    // 5. 调用 add 工具
    const result = await client.callTool({
      name: "add",
      arguments: { a: 5, b: 3 }
    });
    console.log("调用结果:", result);

    // 6. 请求列出资源
    const resourceList = await client.listResources();
    console.log("资源列表:", resourceList);

    // 7. 调用千问大模型
    try {
      console.log("正在调用千问大模型...");
      const qwenResponse = await callQwenAPI("你好，我是MCP客户端，请简单介绍一下自己。");
      console.log("千问大模型回复:", qwenResponse);
    } catch (error) {
      console.error("调用千问大模型时出错:", error);
    }

    // 8. 关闭
    await client.close();
  } catch (error) {
    console.error("MCP Client error:", error);
    process.exit(1);
  }
}

// 运行客户端
runMCPClient();
