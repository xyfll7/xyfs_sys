import { HumanMessage } from "@langchain/core/messages";
import { ChatOllama } from "@langchain/ollama"; // ✅ 新的包
import "dotenv/config";

async function main() {
  // ✅ Ollama 本地模型
  const llm = new ChatOllama({
    model: process.env.OLLAMA_MODEL ?? "gpt-oss",   // 本地已 pull 的模型名
    baseUrl: process.env.OLLAMA_BASEURL ?? "http://localhost:11434", // Ollama 服务地址
    temperature: 0,
  });
  const messages = [new HumanMessage("What is 3 * 12? Also, what is 11 + 49?")];
  const aiMessage = await llm.invoke(messages);
  messages.push(aiMessage);
  console.log(aiMessage.content);
}

main().catch(console.error);
