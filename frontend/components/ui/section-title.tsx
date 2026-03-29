import { cn } from "@/lib/utils";

export function SectionTitle({ title, subtitle, className }: { title: string; subtitle?: string; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {subtitle ? <p className="text-[10px] uppercase tracking-[0.28em] text-ink/50">{subtitle}</p> : null}
      <h2 className="font-display text-2xl text-ink">{title}</h2>
    </div>
  );
}
