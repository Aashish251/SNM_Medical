import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FileUploadField } from "./FileUploadField";
import { openDocumentView } from "@shared/utils/documentHelper";
import { TooltipProvider } from "@shared/components/ui/tooltip";

vi.mock("@shared/utils/documentHelper", () => ({
  openDocumentView: vi.fn(),
}));

describe("FileUploadField", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("opens an existing document through the shared authenticated viewer", () => {
    const register = {
      name: "certificate",
      onChange: vi.fn(),
      onBlur: vi.fn(),
      ref: vi.fn(),
    };

    render(
      <TooltipProvider>
        <FileUploadField
          label="Upload Certificate"
          register={register}
          existingUrl="/uploads/certificate.pdf"
          regId="123"
        />
      </TooltipProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Preview" }));

    expect(openDocumentView).toHaveBeenCalledWith("123");
    expect(screen.queryByRole("link", { name: "Preview" })).toBeNull();
  });
});
