import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { showSubmittedData } from "@admin-panel/lib/show-submitted-data";
import { Button } from "@admin-panel/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@admin-panel/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@admin-panel/components/ui/form";
import { Input } from "@admin-panel/components/ui/input";
import { Textarea } from "@admin-panel/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@admin-panel/components/ui/select";
import type { EntityFormField } from "./types";

type EntityFormDialogProps<T extends { id: string }> = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  fields: EntityFormField[];
  currentRow?: T;
  onSubmit?: (values: Record<string, string>) => void;
};

export function EntityFormDialog<T extends { id: string }>({
  open,
  onOpenChange,
  title,
  description,
  fields,
  currentRow,
  onSubmit,
}: EntityFormDialogProps<T>) {
  const defaultValues = useMemo(
    () =>
      fields.reduce<Record<string, string>>((acc, field) => {
        const rowValue = currentRow?.[field.name as keyof T];
        acc[field.name] =
          rowValue !== undefined && rowValue !== null ? String(rowValue) : "";
        return acc;
      }, {}),
    [fields, currentRow]
  );

  const form = useForm<Record<string, string>>({ defaultValues });

  useEffect(() => {
    if (open) form.reset(defaultValues);
  }, [open, defaultValues, form]);

  const handleOpenChange = (state: boolean) => {
    if (!state) form.reset(defaultValues);
    onOpenChange(state);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-start">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="entity-form"
            onSubmit={form.handleSubmit((values) => {
              if (onSubmit) {
                onSubmit(values);
              } else {
                showSubmittedData(values);
              }
              handleOpenChange(false);
            })}
            className="space-y-4"
          >
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                rules={field.rules ?? { required: `${field.label} is required.` }}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      {field.type === "select" ? (
                        <Select
                          onValueChange={formField.onChange}
                          value={formField.value}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={field.placeholder ?? `Select ${field.label}`}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : field.type === "textarea" ? (
                        <Textarea
                          placeholder={field.placeholder}
                          rows={3}
                          {...formField}
                        />
                      ) : (
                        <Input
                          type={field.type ?? "text"}
                          placeholder={field.placeholder}
                          {...formField}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="entity-form">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
