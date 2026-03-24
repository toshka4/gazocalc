import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}

export function StatCard({ icon: Icon, label, value, sub, accent }: StatCardProps) {
  return (
    <Card
      className={`transition-all hover:shadow-md ${
        accent
          ? "border-primary/30 bg-gradient-to-br from-primary/5 to-blue-50"
          : ""
      }`}
    >
      <CardContent className="flex flex-col gap-1 p-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className={`h-4 w-4 ${accent ? "text-primary" : ""}`} />
          <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
        </div>
        <p className={`text-2xl font-bold ${accent ? "text-primary" : "text-foreground"}`}>
          {value}
        </p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}
