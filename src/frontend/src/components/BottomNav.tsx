import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart2, Compass, Wallet } from "lucide-react";
import { cn } from "../lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Portfolio", icon: Wallet },
  { to: "/market", label: "Market", icon: BarChart2 },
  { to: "/discover", label: "Discover", icon: Compass },
] as const;

export function BottomNav() {
  const { location } = useRouterState();
  const pathname = location.pathname;

  return (
    <nav
      data-ocid="bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-50 glass-header border-t border-border"
      style={{
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="max-w-2xl mx-auto flex items-center justify-around px-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const isActive =
            to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-1 min-w-[64px] py-3 px-4 transition-smooth",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              data-ocid={`nav-${label.toLowerCase()}`}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.8}
                className="transition-smooth"
              />
              <span className="text-[10px] font-mono uppercase tracking-widest">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
