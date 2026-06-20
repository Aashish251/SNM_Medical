import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import type { Row } from "@tanstack/react-table";
import { Download, Eye, Globe, GlobeLock, Trash2, UserPen } from "lucide-react";
import { Button } from "@admin-panel/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@admin-panel/components/ui/dropdown-menu";
import { showSubmittedData } from "@admin-panel/lib/show-submitted-data";
import { useEntityList } from "./entity-list-provider";

type EntityListRowActionsProps<T extends { id: string }> = {
  row: Row<T>;
  mode: "default" | "report";
};

export function EntityListRowActions<T extends { id: string }>({
  row,
  mode,
}: EntityListRowActionsProps<T>) {
  const { setOpen, setCurrentRow, handlers } = useEntityList<T>();
  const status = (row.original as { status?: string }).status;
  const isPublished = status === "published";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original);
            setOpen("view");
          }}
        >
          View
          <DropdownMenuShortcut>
            <Eye size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        {mode === "report" ? (
          <DropdownMenuItem
            onClick={() => {
              showSubmittedData(row.original, "Downloading report:");
            }}
          >
            Download
            <DropdownMenuShortcut>
              <Download size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => {
              setCurrentRow(row.original);
              setOpen("edit");
            }}
          >
            Edit
            <DropdownMenuShortcut>
              <UserPen size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        {handlers.onPublishToggle && (
          <DropdownMenuItem
            onClick={() => handlers.onPublishToggle?.(row.original)}
          >
            {isPublished ? "Unpublish" : "Publish"}
            <DropdownMenuShortcut>
              {isPublished ? <GlobeLock size={16} /> : <Globe size={16} />}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(row.original);
            setOpen("delete");
          }}
          className="text-red-500!"
        >
          Delete
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
