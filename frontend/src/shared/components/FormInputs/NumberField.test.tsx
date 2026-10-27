import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NumberField } from "./NumberField";
import { useForm } from "react-hook-form";

const TestWrapper: React.FC<{
  allowDecimal?: boolean;
  maxWholeDigits?: number;
  maxDecimals?: number;
  maxLength?: number;
  error?: any;
}> = ({ allowDecimal = false, maxWholeDigits, maxDecimals, maxLength, error }) => {
  const { register } = useForm();
  return (
    <NumberField
      label="Total Experience (Years)"
      placeholder="Enter experience"
      allowDecimal={allowDecimal}
      maxWholeDigits={maxWholeDigits}
      maxDecimals={maxDecimals}
      maxLength={maxLength}
      error={error}
      register={register("experience")}
    />
  );
};

describe("NumberField component", () => {
  it("renders with label and placeholder", () => {
    render(<TestWrapper allowDecimal maxWholeDigits={2} maxDecimals={1} />);
    expect(screen.getByLabelText(/Total Experience/i)).toBeDefined();
    expect(screen.getByPlaceholderText("Enter experience")).toBeDefined();
  });

  it("displays error message when error prop is provided", () => {
    render(
      <TestWrapper
        allowDecimal
        maxWholeDigits={2}
        maxDecimals={1}
        error={{ message: "Enter experience between 0 and 50 years, with up to one decimal place" }}
      />
    );
    expect(
      screen.getByText("Enter experience between 0 and 50 years, with up to one decimal place")
    ).toBeDefined();
  });

  it("prevents typing more whole digits than maxWholeDigits (blocks 342)", () => {
    render(<TestWrapper allowDecimal maxWholeDigits={2} maxDecimals={1} />);
    const input = screen.getByPlaceholderText("Enter experience") as HTMLInputElement;

    input.value = "34";
    const event = new KeyboardEvent("keydown", { key: "2", bubbles: true, cancelable: true });
    input.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it("prevents typing more than maxDecimals places (blocks 2.67)", () => {
    render(<TestWrapper allowDecimal maxWholeDigits={2} maxDecimals={1} />);
    const input = screen.getByPlaceholderText("Enter experience") as HTMLInputElement;

    input.value = "2.6";
    input.selectionStart = 3;
    input.selectionEnd = 3;
    const event = new KeyboardEvent("keydown", { key: "7", bubbles: true, cancelable: true });
    input.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it("allows decimal point when allowDecimal is true and input has no dot yet", () => {
    render(<TestWrapper allowDecimal maxWholeDigits={2} maxDecimals={1} />);
    const input = screen.getByPlaceholderText("Enter experience") as HTMLInputElement;

    input.value = "2";
    const event = new KeyboardEvent("keydown", { key: ".", bubbles: true, cancelable: true });
    input.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it("sanitizes pasted or typed input exceeding constraints on change", () => {
    render(<TestWrapper allowDecimal maxWholeDigits={2} maxDecimals={1} />);
    const input = screen.getByPlaceholderText("Enter experience") as HTMLInputElement;

    // Simulate inputting 342
    fireEvent.change(input, { target: { value: "342" } });
    expect(input.value).toBe("34");

    // Simulate inputting 2.67
    fireEvent.change(input, { target: { value: "2.67" } });
    expect(input.value).toBe("2.6");

    // Simulate valid decimal 12.5
    fireEvent.change(input, { target: { value: "12.5" } });
    expect(input.value).toBe("12.5");
  });
});
