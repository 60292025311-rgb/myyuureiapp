import { useState, useEffect, useRef } from "react";

/**
 * タイピングエフェクト用カスタムフック
 * textが変わるたびに、1文字ずつ表示するアニメーションを再生する
 */
export function useTypingEffect(text: string, speed: number = 40) {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // 前回のタイマーをクリア
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDisplayed("");
    setIsTyping(true);

    let index = 0;

    const type = () => {
      if (index < text.length) {
        setDisplayed(text.slice(0, index + 1));
        index++;
        // 句読点・改行の後は少し長めのポーズ
        const char = text[index - 1];
        const pause =
          char === "。" || char === "…" || char === "？" || char === "！" || char === "\n"
            ? speed * 6
            : speed;
        timeoutRef.current = setTimeout(type, pause);
      } else {
        setIsTyping(false);
      }
    };

    timeoutRef.current = setTimeout(type, speed);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, speed]);

  /** タイピングを即座に完了させる（スキップ用） */
  const skip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDisplayed(text);
    setIsTyping(false);
  };

  return { displayed, isTyping, skip };
}
