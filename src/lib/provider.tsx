import { Toasty, TooltipProvider } from "@cloudflare/kumo";
import type { ReactNode } from "react";

export interface AiKitProviderProps {
  children: ReactNode;
}

/**
 * Batteries-included provider for kumo-ai-kit surfaces.
 *
 * Wraps your app with Kumo's `TooltipProvider` (tooltip delay grouping)
 * and `Toasty` (toast notifications), which several kit components rely on.
 *
 * ```tsx
 * <AiKitProvider>
 *   <App />
 * </AiKitProvider>
 * ```
 */
export function AiKitProvider({ children }: AiKitProviderProps) {
  return (
    <TooltipProvider>
      <Toasty>{children}</Toasty>
    </TooltipProvider>
  );
}
