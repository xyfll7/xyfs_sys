"use client";
import { Message, Ollama } from 'ollama/browser';
import { MOCK_SAMPLE_ASS } from "../lib/mock";

const ollama = new Ollama({
  host: 'http://127.0.0.1:11434',
  headers: {
    Authorization: 'Bearer <api key>',
    'User-Agent': 'MyApp/1.0',
  },
});

export function Subtitle({ translateStream }: { translateStream: (e: string) => void; }) {
  const handleMouseUp = () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText && selectedText.trim() !== '') {
      console.log('选中的文字:', selectedText);
      const message = { role: 'user', content: `讲解${selectedText}这个单词，用中文回答` };
      abc(message);
    }
  };

  async function abc(message: Message) {


    try {
      const responseStream = await ollama.chat({
        model: 'deepseek-r1:8b',
        messages: [message],
        think: false,
        stream: true,
      });

      let fullResponse = '';
      for await (const part of responseStream) {
        // 将流式响应逐段渲染到页面
        fullResponse += part.message.content;
        translateStream(fullResponse);
      }
    } catch (error) {
      console.error('Error fetching word explanation:', error);

    } finally {

    }
  }

  return (
    <div className="prose dark:prose-invert flex flex-col" onMouseUp={handleMouseUp}>
      {[...MOCK_SAMPLE_ASS, ...MOCK_SAMPLE_ASS, ...MOCK_SAMPLE_ASS].map((e, i) => <div key={i}>{e.Text}</div>)}
    </div>
  );
}