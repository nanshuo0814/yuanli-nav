"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import type { Theme } from "@/lib/theme";

const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "浅色", icon: <Sun className="h-4 w-4" /> },
  { value: "dark", label: "深色", icon: <Moon className="h-4 w-4" /> },
  { value: "system", label: "跟随系统", icon: <Monitor className="h-4 w-4" /> },
];

/** 主题切换按钮组 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-0.5 rounded-lg border bg-muted/50 p-0.5">
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant={theme === opt.value ? "secondary" : "ghost"}
          size="sm"
          className="h-7 px-2.5 text-xs"
          onClick={() => setTheme(opt.value)}
          title={opt.label}
        >
          {opt.icon}
          <span className="hidden sm:inline">{opt.label}</span>
        </Button>
      ))}
    </div>
  );
}
