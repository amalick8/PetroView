import { cn } from "@/lib/utils";

export function Metric({ label, value, detail, className }: { label: string; value: string; detail?: string; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-ember/60 bg-panel/80 p-4 shadow-inset", className)}>
      <p className="text-[10px] uppercase tracking-[0.28em] text-ink/50">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
      {detail ? <p className="mt-2 text-xs text-ink/60">{detail}</p> : null}
    </div>
  );
}
