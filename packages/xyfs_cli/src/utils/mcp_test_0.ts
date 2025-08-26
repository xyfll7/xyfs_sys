import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { z } from "zod";

const abc = z.string().describe("Text to summarize");

async function testMCPClient() {
  try {
    // Create client transport
    const transport = new StdioClientTransport({
      command: "npx",
      args: ["tsx", "src/utils/mcp_server.ts"]
    });

    // Create MCP client
    const client = new Client(
      {
        name: "mcp-test-client",
        version: "1.0.0",
      },
      {
        capabilities: {}
      }
    );

    // Connect client to server
    await client.connect(transport);
    console.log("✅ MCP Client connected!");

    // List available tools (this method is supported by our server)
    const tools = await client.listTools();
    console.log("Available tools:", tools);

    // Call the greet tool (this method is also supported by our server)
    const result = await client.callTool({
      name: "greet",
      arguments: {
        name: "Test User"
      }
    });
    console.log("Greet tool result:", result);

    // Close the client
    await client.close();
  } catch (error) {
    console.error("MCP Test error:", error);
    process.exit(1);
  }
}

// Run the test
testMCPClient();