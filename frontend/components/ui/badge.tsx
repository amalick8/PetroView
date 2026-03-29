import * as React from "react";

import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-ocean/50 bg-ocean/15 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-ink",
        className
      )}
      {...props}
    />
  );
}
