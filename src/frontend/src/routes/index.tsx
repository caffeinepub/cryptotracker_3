import { createRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { AddHoldingDrawer } from "../components/AddHoldingDrawer";
import { DashboardHeader } from "../components/DashboardHeader";
import { FearGreedWidget } from "../components/FearGreedWidget";
import { HoldingsList } from "../components/HoldingsList";
import { PortfolioChart } from "../components/PortfolioChart";
import { useAuth } from "../hooks/use-auth";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: PortfolioPage,
});

function PortfolioPage() {
  const { isAuthenticated, isInitializing, login, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <DashboardHeader onLogout={logout} onAdd={() => setDrawerOpen(true)} />

      {/* Charts section */}
      <div className="space-y-3 pt-3">
        <PortfolioChart />
        <FearGreedWidget />
      </div>

      {/* Holdings */}
      <div className="mt-4">
        <HoldingsList onAddHolding={() => setDrawerOpen(true)} />
      </div>

      <AddHoldingDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
          Initializing
        </span>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 gap-8 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-glass">
            <TrendingUp className="text-primary" size={32} />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary animate-pulse-soft" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">
            CRYPTO TERMINAL
          </h1>
          <p className="text-muted-foreground text-sm font-mono tracking-wide">
            Bloomberg-grade portfolio intelligence
          </p>
        </div>
        <div className="w-full max-w-xs space-y-3 text-left">
          {[
            "Real-time CoinGecko prices",
            "On-chain portfolio storage",
            "P&L tracking with cost basis",
          ].map((feat, i) => (
            <motion.div
              key={feat}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              {feat}
            </motion.div>
          ))}
        </div>
        <button
          type="button"
          onClick={onLogin}
          data-ocid="login-btn"
          className="w-full max-w-xs h-12 rounded font-mono text-sm tracking-widest uppercase bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth flex items-center justify-center"
        >
          Connect with Internet Identity
        </button>
        <p className="text-xs text-muted-foreground/60 font-mono">
          Decentralized. Non-custodial. Private.
        </p>
      </motion.div>
    </div>
  );
}
