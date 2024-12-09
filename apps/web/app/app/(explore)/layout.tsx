import type { ReactNode } from "react";
import { Toaster } from "sonner";

export default function ExploreLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
}
