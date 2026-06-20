import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@admin-panel/components/ui/dialog";

type EntityViewDialogProps<T extends Record<string, unknown>> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  row: T;
  labels: Partial<Record<keyof T, string>>;
};

export function EntityViewDialog<T extends Record<string, unknown>>({
  open,
  onOpenChange,
  title,
  row,
  labels,
}: EntityViewDialogProps<T>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Record details</DialogDescription>
        </DialogHeader>
        <dl className="space-y-3 text-sm">
          {Object.entries(row).map(([key, value]) => (
            <div key={key} className="grid grid-cols-3 gap-2">
              <dt className="font-medium text-muted-foreground">
                {labels[key as keyof T] ?? key}
              </dt>
              <dd className="col-span-2">{String(value ?? "—")}</dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
