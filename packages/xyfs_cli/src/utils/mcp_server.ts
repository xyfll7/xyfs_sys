import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool
} from '@modelcontextprotocol/sdk/types.js';

// 1. 创建一个 MCP 服务器实例
const server = new Server(
  {
    name: 'my-first-mcp-agent',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 2. 定义工具列表
const tools: Tool[] = [
  {
    name: 'greet',
    description: 'Generate a friendly greeting for a person.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the person to greet.',
        },
      },
      required: ['name'],
    },
  },
];

// 3. 处理客户端请求列出所有可用工具
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

// 4. 处理客户端调用工具的请求
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'greet') {
    const userName = (args as { name: string; })?.name || 'World';

    return {
      content: [
        {
          type: 'text',
          text: `Hello, ${userName}! This is your MCP agent speaking....`,
        },
      ],
    };
  }

  throw new Error(`Tool ${name} not found`);
});

// 5. 启动服务器
const transport = new StdioServerTransport();
server.connect(transport)
  .then(() => {
    console.log('MCP Server running on STDIO'); // 成功信息
  })
  .catch((error) => {
    console.error('Failed to start server:', error); // 真正的错误信息
    process.exit(1);
  });