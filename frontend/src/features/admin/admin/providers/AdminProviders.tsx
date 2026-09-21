import type { ReactNode } from "react";
import { ThemeProvider } from "@admin/context/theme-provider";
import { DirectionProvider } from "@admin/context/direction-provider";
import { Toaster } from "@admin/components/ui/sonner";

type AdminProvidersProps = {
  children: ReactNode;
};

export function AdminProviders({ children }: AdminProvidersProps) {
  return (
    <ThemeProvider>
      <DirectionProvider>
        {children}
        <Toaster duration={5000} />
      </DirectionProvider>
    </ThemeProvider>
  );
}
