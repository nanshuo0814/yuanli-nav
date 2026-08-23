/** 页脚 */
export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="font-semibold text-sm">源力导航</p>
            <p className="text-xs text-muted-foreground mt-1">
              干净、现代的全网资源聚合导航
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
