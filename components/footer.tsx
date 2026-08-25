import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

/** 页脚 */
export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8 space-y-4">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground justify-center sm:justify-start">
          <Link href="/collection/" className="hover:text-foreground">
            编辑精选
          </Link>
          <Link href="/weekly/" className="hover:text-foreground">
            源力周刊
          </Link>
          <Link href="/broken/" className="hover:text-foreground">
            失效链接
          </Link>
          <a
            href={siteConfig.githubRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={`${siteConfig.githubRepoUrl}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            贡献收录
          </a>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="font-semibold text-sm">源力导航</p>
            <p className="text-xs text-muted-foreground mt-1">
              干净、现代的全网资源聚合导航 · 快捷键 j/k 移动 · f 收藏 · / 搜索
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} 源力导航 · 数据本地静态存储
          </p>
        </div>
      </div>
    </footer>
  );
}
