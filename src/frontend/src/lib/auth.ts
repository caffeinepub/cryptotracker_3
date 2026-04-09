// Auth utilities — thin wrappers used across the app
// Primary hook: use-auth.ts (wraps useInternetIdentity)

export function truncatePrincipal(principal: string, chars = 8): string {
  if (principal.length <= chars * 2 + 3) return principal;
  return `${principal.slice(0, chars)}...${principal.slice(-chars)}`;
}

export function getPrincipalLabel(principal: string): string {
  return truncatePrincipal(principal, 5);
}
