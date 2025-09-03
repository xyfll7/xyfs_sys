"use client";
import { MOCK_SAMPLE_ASS } from "../lib/mock";

import { Message, Ollama } from 'ollama/browser';


const ollama = new Ollama({
  host: 'http://127.0.0.1:11434',
  headers: {
    Authorization: 'Bearer <api key>',
    'User-Agent': 'MyApp/1.0',
  },
});


export function Subtitle() {
  const handleMouseUp = () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText && selectedText.trim() !== '') {
      console.log('选中的文字:', selectedText);
      const message = { role: 'user', content: `${selectedText} 讲解该单词` };
      abc(message);
    }
  };

  async function abc(message: Message) {
    const response = await ollama.chat({
      model: 'llama3.2',
      messages: [message],
      stream: true,
    });
    for await (const part of response) {
      // 此处是一个流，我想讲它渲染到页面中去
      console.log(part.message.content);
    }
  }

  return (
    <div className="flex flex-col" onMouseUp={handleMouseUp}>
      {[...MOCK_SAMPLE_ASS, ...MOCK_SAMPLE_ASS, ...MOCK_SAMPLE_ASS].map((e, i) => {
        return <div key={i}>{e.Text}</div>;
      })}
    </div>
  );
}