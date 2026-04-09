import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const { identity, login, clear, loginStatus, isInitializing, isLoggingIn } =
    useInternetIdentity();

  const isAuthenticated = !!identity;
  const principal = identity?.getPrincipal();

  return {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    loginStatus,
    principal,
    login,
    logout: clear,
  };
}
