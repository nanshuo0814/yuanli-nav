import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** 404 页面 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl font-bold text-primary/30 mb-2">404</p>
      <h1 className="text-xl font-semibold mb-2">页面未找到</h1>
      <p className="text-sm text-muted-foreground mb-8 max-w-sm">
        你访问的页面不存在，可能已被移除或地址有误
      </p>
      <div className="flex gap-3">
        <Link href="/" className={cn(buttonVariants(), "gap-1.5")}>
          <Home className="h-4 w-4" />
          返回首页
        </Link>
        <Link
          href="/favorites/"
          className={cn(buttonVariants({ variant: "outline" }), "gap-1.5")}
        >
          <Compass className="h-4 w-4" />
          我的收藏
        </Link>
      </div>
    </div>
  );
}
