import * as React from "react";
import { CustomField } from "./ReportColumnDef";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@admin/components/ui/select";
import { Label } from "@admin/components/ui/label";
import { Checkbox } from "@admin/components/ui/checkbox";
import { CalendarDays, LayoutList, Type, HelpingHand, X } from "lucide-react";

const FIELD_TYPE_ICONS: Record<string, React.ComponentType<any>> = {
  text: Type,
  number: LayoutList,
  date: CalendarDays,
  select: HelpingHand,
};

export function CustomFieldEditor({
  field,
  onChange,
  onRemove,
}: {
  field: CustomField;
  onChange: (field: CustomField) => void;
  onRemove: (key: string) => void;
}) {
  const [optionsText, setOptionsText] = React.useState(
    field.options?.join("\n") || ""
  );

  const handleOptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOptionsText(e.target.value);
    onChange({
      ...field,
      options: e.target.value
        .split("\n")
        .map((opt) => opt.trim())
        .filter((opt) => opt.length > 0),
    });
  };

  const updateField = (key: keyof CustomField, value: any) => {
    onChange({
      ...field,
      [key]: value,
    });
  };

  const FieldIcon = FIELD_TYPE_ICONS[field.type];

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {FieldIcon && <FieldIcon className="h-4 w-4 text-primary" />}
          <h3 className="font-medium">{field.label}</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="p-1"
          onClick={() => onRemove(field.key)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      <div className="grid gap-3 mb-4">
        <div>
          <Label htmlFor={`field-label-${field.key}`}>Label</Label>
          <Input
            id={`field-label-${field.key}`}
            value={field.label}
            onChange={(e) => updateField("label", e.target.value)}
            placeholder="Enter field label"
          />
        </div>

        <div>
          <Label htmlFor={`field-key-${field.key}`}>Key (for API)</Label>
          <Input
            id={`field-key-${field.key}`}
            value={field.key}
            onChange={(e) => updateField("key", e.target.value)}
            placeholder="e.g. custom_field_1"
          />
        </div>

        <div>
          <Label htmlFor={`field-type-${field.key}`}>Field Type</Label>
          <Select
            value={field.type}
            onValueChange={(value: "text" | "number" | "date" | "select") => updateField("type", value)}
          >
            <SelectTrigger id={`field-type-${field.key}`}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="select">Dropdown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {field.type === "select" && (
          <div>
            <Label htmlFor={`field-options-${field.key}`}>Options (one per line)</Label>
            <textarea
              id={`field-options-${field.key}`}
              value={optionsText}
              onChange={handleOptionChange}
              className="h-20 w-full rounded border p-2"
              placeholder="Option 1&#10;Option 2&#10;Option 3"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <Checkbox
            id={`field-description-${field.key}`}
            checked={!!field.description}
            onCheckedChange={(checked) =>
              updateField("description", checked ? " " : undefined)
            }
          />
          <Label htmlFor={`field-description-${field.key}`}>Add description</Label>
        </div>
        {field.description !== undefined && (
          <Input
            id={`field-description-value-${field.key}`}
            value={field.description.trim()}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Enter description"
          />
        )}

        <div className="flex items-center gap-2">
          <Checkbox
            id={`field-default-${field.key}`}
            checked={field.defaultValue !== undefined}
            onCheckedChange={(checked) =>
              updateField("defaultValue", checked ? "" : undefined)
            }
          />
          <Label htmlFor={`field-default-${field.key}`}>Set default value</Label>
        </div>
        {field.defaultValue !== undefined && (
          <Input
            id={`field-default-value-${field.key}`}
            value={typeof field.defaultValue === "number" ? field.defaultValue.toString() : field.defaultValue || ""}
            onChange={(e) =>
              updateField(
                "defaultValue",
                field.type === "number" ? Number(e.target.value) : e.target.value
              )
            }
            placeholder="Default value"
          />
        )}
      </div>
    </div>
  );
}