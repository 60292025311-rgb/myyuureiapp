"use client";

import { useEffect } from "react";
import { useTypingEffect } from "@/hooks/useTypingEffect";

interface DialogBoxProps {
  text: string;
  speed?: number;
  onTypingDone?: () => void;
}

export default function DialogBox({ text, speed = 35, onTypingDone }: DialogBoxProps) {
  const { displayed, isTyping, skip } = useTypingEffect(text, speed);

  // タイピング完了時にコールバックを呼ぶ
  useEffect(() => {
    if (!isTyping && displayed === text && text.length > 0 && onTypingDone) {
      const id = setTimeout(onTypingDone, 0);
      return () => clearTimeout(id);
    }
  }, [isTyping, displayed, text, onTypingDone]);

  return (
    <div
      className="relative cursor-pointer select-none"
      onClick={skip}
      title={isTyping ? "クリックでスキップ" : ""}
    >
      {/* 発話者名 */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
        <span className="text-red-500 text-xs font-mono tracking-widest uppercase">
          Tagosaku Suzuki
        </span>
        {isTyping && (
          <span className="text-gray-600 text-xs ml-auto animate-pulse">
            ▶ クリックでスキップ
          </span>
        )}
      </div>

      {/* セリフ本文 */}
      <div
        className="
          min-h-[140px] px-5 py-4 rounded border border-gray-800
          bg-[#0d0d0d] text-gray-200 text-sm font-mono leading-8
          whitespace-pre-wrap
        "
        style={{ textShadow: "0 0 8px rgba(200,200,200,0.15)" }}
      >
        {displayed}
        {isTyping && <span className="cursor-blink" />}
      </div>
    </div>
  );
}
