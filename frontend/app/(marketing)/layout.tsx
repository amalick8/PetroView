import type { ReactNode } from "react";

import { Navbar } from "@/components/ui/navbar";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="px-6">
      <div className="mx-auto max-w-6xl pt-8">
        <Navbar />
      </div>
      {children}
    </div>
  );
}
