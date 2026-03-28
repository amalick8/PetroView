import { cn } from "@/lib/utils";

export function Metric({ label, value, detail, className }: { label: string; value: string; detail?: string; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-slate/70 p-4", className)}>
      <p className="text-xs uppercase tracking-[0.2em] text-mist/50">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {detail ? <p className="mt-2 text-sm text-mist/70">{detail}</p> : null}
    </div>
  );
}
