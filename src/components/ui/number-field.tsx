import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
  min?: number;
  step?: number;
  hint?: string;
}

export function NumberField({
  label,
  value,
  onChange,
  unit,
  min = 0,
  step = 1,
  hint,
}: NumberFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {unit && <span className="ml-1 text-muted-foreground">({unit})</span>}
      </Label>
      <Input
        type="number"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        step={step}
        className="h-10"
        placeholder="0"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
