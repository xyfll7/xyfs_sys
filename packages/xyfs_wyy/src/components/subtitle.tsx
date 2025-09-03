"use client";
import { MOCK_SAMPLE_ASS } from "../lib/mock";

export function Subtitle() {
  const handleMouseUp = () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText && selectedText.trim() !== '') {
      console.log('选中的文字:', selectedText);
    }
  };

  return (
    <div className="flex flex-col" onMouseUp={handleMouseUp}>
      {[...MOCK_SAMPLE_ASS, ...MOCK_SAMPLE_ASS, ...MOCK_SAMPLE_ASS].map((e, i) => {
        return <div key={i}>{e.Text}</div>;
      })}
    </div>
  );
}