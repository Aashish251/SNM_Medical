import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";

export function NavigationProgress() {
  const ref = useRef<LoadingBarRef>(null);
  const location = useLocation();

  useEffect(() => {
    ref.current?.continuousStart();
    const timer = window.setTimeout(() => {
      ref.current?.complete();
    }, 300);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search]);

  return (
    <LoadingBar
      color="var(--muted-foreground)"
      ref={ref}
      shadow={true}
      height={2}
    />
  );
}
