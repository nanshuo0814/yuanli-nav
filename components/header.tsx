"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Heart,
  History,
  Menu,
  PlusCircle,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/use-favorites";
import { getSubmitResourceUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "首页", icon: Compass },
  { href: "/favorites/", label: "收藏", icon: Heart, showCount: true },
  { href: "/history/", label: "历史", icon: History },
];

/** 顶部导航栏 */
export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { favorites, mounted } = useFavorites();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </div>
          <span className="hidden sm:inline">源力导航</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent",
                pathname === item.href &&
                  "bg-accent text-accent-foreground font-medium"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.showCount && mounted && favorites.length > 0 && (
                <Badge
                  variant="secondary"
                  className="h-5 min-w-5 px-1 text-[10px] font-normal"
                >
                  {favorites.length}
                </Badge>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={getSubmitResourceUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden sm:inline-flex h-8 gap-1.5")}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            我要收录
          </a>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="菜单"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t bg-background px-4 py-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-accent",
                pathname === item.href && "bg-accent font-medium"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.showCount && mounted && favorites.length > 0 && (
                <Badge variant="secondary" className="ml-auto text-[10px]">
                  {favorites.length}
                </Badge>
              )}
            </Link>
          ))}
          <a
            href={getSubmitResourceUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm hover:bg-accent"
            onClick={() => setMobileOpen(false)}
          >
            <PlusCircle className="h-4 w-4" />
            我要收录
          </a>
        </nav>
      )}
    </header>
  );
}
