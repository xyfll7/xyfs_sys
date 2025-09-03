import ollama from 'ollama';

const message = { role: 'user', content: 'gemma3 llama3.2 对比二者,用中文回答' };
const response = await ollama.chat({
  model: 'llama3.2',
  messages: [message],
  stream: true,
});
for await (const part of response) {
  process.stdout.write(part.message.content);
}