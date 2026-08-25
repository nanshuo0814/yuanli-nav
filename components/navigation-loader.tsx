"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

/** 首屏 + 路由切换：居中 Logo + 进度条过渡 */
export function NavigationLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const isFirstLoad = useRef(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const runProgress = (fast = false) => {
    clearTimer();
    setVisible(true);
    setFading(false);
    setProgress(0);

    let value = 0;
    timerRef.current = setInterval(() => {
      const step = fast
        ? 18 + Math.random() * 22
        : 6 + Math.random() * 14;
      value = Math.min(100, value + step);
      setProgress(value);

      if (value >= 100) {
        clearTimer();
        setTimeout(() => {
          setFading(true);
          setTimeout(() => setVisible(false), 280);
        }, fast ? 120 : 220);
      }
    }, fast ? 40 : 70);
  };

  useEffect(() => {
    runProgress(false);
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    runProgress(true);
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-background/90 backdrop-blur-md transition-opacity duration-300",
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
      aria-live="polite"
      aria-busy={!fading}
      aria-label="页面加载中"
    >
      <div className="flex flex-col items-center gap-6 w-full max-w-xs px-6">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl scale-150 animate-pulse" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <Zap className="h-8 w-8" strokeWidth={2.2} />
          </div>
        </div>

        <div className="w-full space-y-2 text-center">
          <p className="text-base font-semibold tracking-tight">源力导航</p>
          <p className="text-xs text-muted-foreground">正在加载资源...</p>
        </div>

        <div className="w-full space-y-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground text-center tabular-nums">
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    </div>
  );
}
