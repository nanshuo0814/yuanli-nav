"use client";

import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  /** 窄内容页（详情、历史等） */
  narrow?: boolean;
}

/** 统一页面左右间距与最大宽度 */
export function PageContainer({
  children,
  className,
  narrow = false,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "page-container animate-in fade-in duration-300",
        narrow && "max-w-4xl",
        className
      )}
    >
      {children}
    </div>
  );
}
