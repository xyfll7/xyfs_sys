import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { DynamicStructuredTool, tool } from "@langchain/core/tools";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config";
import { z } from "zod";

// ========================
// 1. 定义菜单数据（模拟数据库）
// ========================
const menu = [
  { name: "宫保鸡丁", price: 32 },
  { name: "鱼香肉丝", price: 30 },
  { name: "麻婆豆腐", price: 18 },
  { name: "红烧肉", price: 38 },
  { name: "清炒时蔬", price: 15 },
  { name: "可乐", price: 5 },
  { name: "雪碧", price: 5 },
  { name: "酸梅汤", price: 8 },
];

// ========================
// 2. 定义工具
// ========================

// 工具1：获取菜单
const getMenuTool = tool(
  async () => {
    return JSON.stringify(menu, null, 2);
  },
  {
    name: "getMenu",
    description: "当顾客说出一个菜名，你必须使用这个工具来查看菜单。",
    schema: z.object({}),
  }
);

// 工具2：计算订单总价
const calculateTotalTool = tool(
  async ({ items }) => {
    let total = 0;
    const results: { name: string; price: number; quantity: number; found: boolean; }[] = [];

    for (const item of items) {
      const menuItem = menu.find((m) => m.name === item.name);
      if (menuItem) {
        total += menuItem.price * item.quantity;
        results.push({ ...menuItem, quantity: item.quantity, found: true });
      } else {
        results.push({ name: item.name, price: 0, quantity: item.quantity, found: false });
      }
    }

    return JSON.stringify({
      total,
      details: results,
    }, null, 2);
  },
  {
    name: "calculateTotal",
    description: "根据点菜列表计算总价。",
    schema: z.object({
      items: z.array(
        z.object({
          name: z.string().describe("菜品名称"),
          quantity: z.number().int().min(1).describe("数量"),
        })
      ),
    }),
  }
);

// 工具3：提交订单
const placeOrderTool = tool(
  async ({ items, total }) => {
    const orderId = "ORD-" + Date.now().toString().slice(-6);
    console.log(`[Order Placed] ID: ${orderId}, Total: ${total}, Items:`, items);
    return JSON.stringify({
      orderId,
      status: "已提交",
      total,
      items,
      estimatedTime: "30分钟",
    }, null, 2);
  },
  {
    name: "placeOrder",
    description: "提交订单，生成订单号。",
    schema: z.object({
      items: z.array(
        z.object({
          name: z.string(),
          quantity: z.number(),
        })
      ),
      total: z.number(),
    }),
  }
);

// ========================
// 3. 主函数
// ========================
async function main() {

  const tools = [getMenuTool, calculateTotalTool, placeOrderTool];
  const toolsByName: { [key: string]: DynamicStructuredTool; } = {
    getMenu: getMenuTool,
    calculateTotal: calculateTotalTool,
    placeOrder: placeOrderTool,
  };

  // 初始化模型
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0.3,
    apiKey: process.env.GOOGLE_API_KEY!,
  });

  // 绑定工具
  const llmWithTools = llm.bindTools(tools);
  const userInput = "我想点两份宫保鸡丁、一份麻婆豆腐和三瓶可乐，请帮我下单。";;
  // 构建消息
  const messages = [
    new SystemMessage(
      "你是一个餐厅点餐助手。" +
      "当用户点菜时，必须调用 getMenu 工具确认菜品是否存在，" +
      "然后调用 calculateTotal 计算总价，最后自动提交订单。"
      // "不要直接猜测价格或菜单内容。"
    ),
    new HumanMessage(userInput)];

  // 第一次调用：模型决定使用哪些工具
  const aiMessage = await llmWithTools.invoke(messages);
  messages.push(aiMessage);

  console.log("AI 决定调用工具:", aiMessage.tool_calls);

  // 收集中间结果
  let calculatedTotal: number | null = null;
  let orderItems: Array<{ name: string; quantity: number; }> = [];

  // 处理工具调用
  if ('tool_calls' in aiMessage && Array.isArray(aiMessage.tool_calls)) {
    for (const toolCall of aiMessage.tool_calls) {
      const selectedTool = toolsByName[toolCall.name];
      if (!selectedTool) continue;

      try {
        const result = await selectedTool.invoke(toolCall);
        messages.push(result);

        // 解析结果，用于后续判断是否需要下单
        if (toolCall.name === "calculateTotal") {
          const parsed = JSON.parse(result.content as string);
          calculatedTotal = parsed.total;
          orderItems = parsed.details
            .filter((d: any) => d.found)
            .map((d: any) => ({ name: d.name, quantity: d.quantity }));
        }
      } catch (err) {
        console.error(`调用工具 ${toolCall.name} 失败:`, err);
        messages.push(new HumanMessage(`工具调用失败: `));
      }
    }
  }

  // 如果计算出总价，自动触发下单
  if (calculatedTotal !== null && orderItems.length > 0) {
    const placeOrderCall = await placeOrderTool.invoke({
      name: "placeOrder",
      args: { items: orderItems, total: calculatedTotal },
    });
    messages.push(placeOrderCall);
  }

  // 最终调用，生成自然语言回复
  const finalResponse = await llmWithTools.invoke(messages);
  console.log("✅ 最终回复:");
  console.log(finalResponse.content);
}

// 执行主函数
main().catch(console.error);