// mcp_client.ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

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

    // 7. 关闭
    await client.close();
  } catch (error) {
    console.error("MCP Client error:", error);
    process.exit(1);
  }
}

// 运行客户端
runMCPClient();
