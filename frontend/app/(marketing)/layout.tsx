import type { ReactNode } from "react";

import { Navbar } from "@/components/ui/navbar";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="px-0">
      <div className="sticky top-6 z-30 mx-auto w-full max-w-none px-6 pt-8">
        <Navbar />
      </div>
      {children}
    </div>
  );
}
