import { Card } from "@/components/ui/card";

export function InsightCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="p-6">
      <p className="text-xs uppercase tracking-[0.25em] text-gold/70">Insight</p>
      <h3 className="mt-3 font-display text-xl text-white">{title}</h3>
      <p className="mt-2 text-sm text-mist/70">{description}</p>
    </Card>
  );
}
