import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextField } from "./TextField";
import { FieldErrorText } from "./FormHelpers";
import { useForm } from "react-hook-form";

const TestWrapper: React.FC<{
  error?: any;
  showError?: boolean;
}> = ({ error, showError }) => {
  const { register } = useForm();
  return (
    <TextField
      label="Birthdate"
      register={register("dateOfBirth")}
      placeholder="DD/MM/YYYY"
      error={error}
      showError={showError}
    />
  );
};

describe("TextField and FieldErrorText", () => {
  it("renders with label and placeholder", () => {
    render(<TestWrapper />);
    expect(screen.getByText(/Birthdate/i)).toBeDefined();
    expect(screen.getByPlaceholderText("DD/MM/YYYY")).toBeDefined();
  });

  it("renders error message by default when showError is not false", () => {
    render(
      <TestWrapper
        error={{ message: "Enter a valid birthdate no more than 120 years ago" }}
      />
    );
    expect(
      screen.getByText("Enter a valid birthdate no more than 120 years ago")
    ).toBeDefined();
  });

  it("hides internal error message when showError is false", () => {
    render(
      <TestWrapper
        error={{ message: "Enter a valid birthdate no more than 120 years ago" }}
        showError={false}
      />
    );
    expect(
      screen.queryByText("Enter a valid birthdate no more than 120 years ago")
    ).toBeNull();
  });

  it("renders FieldErrorText with custom className for single-line display", () => {
    render(
      <FieldErrorText
        message="Enter a valid birthdate no more than 120 years ago"
        className="whitespace-nowrap"
      />
    );
    const element = screen.getByText(
      "Enter a valid birthdate no more than 120 years ago"
    );
    expect(element.className).toContain("whitespace-nowrap");
  });
});
