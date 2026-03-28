import { cn } from "@/lib/utils";

export function SectionTitle({ title, subtitle, className }: { title: string; subtitle?: string; className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <h2 className="font-display text-2xl text-white">{title}</h2>
      {subtitle ? <p className="text-sm text-mist/70">{subtitle}</p> : null}
    </div>
  );
}
