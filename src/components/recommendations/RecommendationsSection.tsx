import { RECOMMENDATIONS } from "@/data/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, TreePine, LayoutPanelLeft, Warehouse, Flame } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Home,
  trees: TreePine,
  layout: LayoutPanelLeft,
  warehouse: Warehouse,
  flame: Flame,
};

export function RecommendationsSection() {
  return (
    <section id="recommendations" className="scroll-mt-20 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Какой газобетонный блок выбрать для строительства?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Подбор оптимальной толщины стен и плотности газоблока (D400, D500, D600)
            для разных типов построек — жилой дом, дача, гараж, баня
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {RECOMMENDATIONS.map((rec) => {
            const Icon = ICON_MAP[rec.icon] ?? Home;
            return (
              <Card
                key={rec.id}
                className="group transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <CardHeader className="pb-3">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{rec.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {rec.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      Толщина: {rec.thickness}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Плотность: {rec.density}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
