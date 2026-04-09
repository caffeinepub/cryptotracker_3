import { useAuth } from "../hooks/use-auth";
import { cn } from "../lib/utils";
import { BottomNav } from "./BottomNav";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main
        className={cn(
          "flex-1 w-full max-w-2xl mx-auto",
          isAuthenticated ? "pb-20" : "",
          className,
        )}
      >
        {children}
      </main>
      {isAuthenticated && <BottomNav />}
    </div>
  );
}
