import { Switch } from "@/components/ui/switch";

interface SwitchRowProps {
  title: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  children?: React.ReactNode;
}

export function SwitchRow({
  title,
  description,
  checked,
  onCheckedChange,
  children,
}: SwitchRowProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
      </div>
      {checked && children && (
        <div className="ml-0 mt-3 max-w-xs sm:ml-4">{children}</div>
      )}
    </div>
  );
}
