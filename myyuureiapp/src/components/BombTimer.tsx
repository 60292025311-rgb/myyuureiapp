"use client";

import { useEffect, useState, useRef } from "react";

interface BombTimerProps {
  seconds: number;
  onExpire: () => void;
  stopped: boolean;
}

export default function BombTimer({ seconds, onExpire, stopped }: BombTimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (stopped) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopped]);

  const pct = (remaining / seconds) * 100;
  const danger = remaining <= 30;

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-xs font-mono">
        <span className={danger ? "text-red-500 animate-pulse" : "text-gray-500"}>
          {danger ? "⚠ TIME CRITICAL" : "TIME REMAINING"}
        </span>
        <span className={danger ? "text-red-400 font-bold text-sm" : "text-gray-400"}>
          {String(Math.floor(remaining / 60)).padStart(2, "0")}:
          {String(remaining % 60).padStart(2, "0")}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            danger ? "bg-red-600" : "bg-amber-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
