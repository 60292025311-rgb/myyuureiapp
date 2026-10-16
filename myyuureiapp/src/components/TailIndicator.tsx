"use client";

interface TailIndicatorProps {
  total: number;       // 9
  current: number;     // 現在の質問インデックス (0-based)
  answered: number;    // 回答済み数
}

export default function TailIndicator({ total, current, answered }: TailIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-gray-500 tracking-[0.3em] uppercase">Nine Tails</p>
      <div className="flex gap-2 items-center">
        {Array.from({ length: total }, (_, i) => {
          let stateClass = "tail-inactive";
          if (i < answered) stateClass = "tail-answered";
          else if (i === current) stateClass = "tail-active animate-pulse_slow";

          return (
            <div
              key={i}
              className={`tail-icon ${stateClass}`}
              title={`Q${i + 1}`}
            />
          );
        })}
      </div>
      <p className="text-xs text-gray-600">
        {answered < total ? `${current + 1} / ${total}` : "COMPLETE"}
      </p>
    </div>
  );
}
