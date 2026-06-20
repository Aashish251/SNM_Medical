import type { ReactNode } from "react";
import { ThemeProvider } from "@admin-panel/context/theme-provider";
import { DirectionProvider } from "@admin-panel/context/direction-provider";
import { Toaster } from "@admin-panel/components/ui/sonner";

type AdminPanelProvidersProps = {
  children: ReactNode;
};

export function AdminPanelProviders({ children }: AdminPanelProvidersProps) {
  return (
    <ThemeProvider>
      <DirectionProvider>
        {children}
        <Toaster duration={5000} />
      </DirectionProvider>
    </ThemeProvider>
  );
}
