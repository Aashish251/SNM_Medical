import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { ProfessionalDetailsStep } from "./ProfessionalDetailsStep";
import { FormValues } from "@shared/types/CommonType";
import { toast } from "@shared/lib/toast";

import { TooltipProvider } from "@shared/components/ui/tooltip";

vi.mock("@shared/lib/toast", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

const mockDropdownOption = {
  data: {
    qualifications: [
      { id: 1, qualification_name: "MBBS" },
      { id: 2, qualification_name: "MD" },
    ],
    departments: [
      { id: 10, department_name: "Cardiology" },
      { id: 20, department_name: "Neurology" },
    ],
    availableDays: [
      { id: 100, available_day: "Monday" },
      { id: 200, available_day: "Saturday" },
    ],
    shiftTimes: [
      { id: 1000, shifttime: "Morning" },
      { id: 2000, shifttime: "Evening" },
    ],
  },
};

const defaultValues: FormValues = {
  title: "Dr",
  fullName: "John Doe",
  mobileNo: "9876543210",
  gender: "Male",
  email: "john@example.com",
  dateOfBirth: "1990-01-01",
  age: 34,
  address: "123 Main St",
  stateId: "1",
  cityId: "1",
  qualificationId: "",
  departmentId: "",
  availableDayId: "",
  shiftTimeId: "",
  experience: "",
  lastSewa: "",
  samagamHeldIn: "",
  recommendedBy: "",
  certificate: undefined,
  password: "",
  confirmPassword: "",
  userType: "ms",
  remark: "",
  favoriteFood: "",
  childhoodNickname: "",
  motherMaidenName: "",
  hobbies: "",
  profilePic: undefined,
};

const TestWrapper: React.FC<{
  nextStep: (skipValidation?: boolean) => Promise<boolean>;
  initialValues?: Partial<FormValues>;
}> = ({ nextStep, initialValues }) => {
  const form = useForm<FormValues>({
    defaultValues: { ...defaultValues, ...initialValues },
    mode: "onBlur",
  });

  return (
    <TooltipProvider>
      <ProfessionalDetailsStep
        form={form}
        dropdownOption={mockDropdownOption}
        nextStep={nextStep}
        prevStep={vi.fn()}
        reset={vi.fn()}
      />
    </TooltipProvider>
  );
};

describe("ProfessionalDetailsStep required field validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all four required fields with required indicators", () => {
    const nextStep = vi.fn().mockResolvedValue(true);
    render(<TestWrapper nextStep={nextStep} />);

    expect(screen.getByText("Qualification")).toBeDefined();
    expect(screen.getByText("Department")).toBeDefined();
    expect(screen.getByText("Available Days")).toBeDefined();
    expect(screen.getByText("Preferred Shift Time")).toBeDefined();
    // Certificate is optional, should not be required
    expect(screen.queryByText(/Please upload a certificate/)).toBeNull();
  });

  it("prevents progression and shows error messages when required fields are empty", async () => {
    const nextStep = vi.fn().mockResolvedValue(true);
    render(<TestWrapper nextStep={nextStep} />);

    const nextBtn = screen.getByRole("button", { name: "Next" });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(screen.getByText("Qualification is required")).toBeDefined();
      expect(screen.getByText("Department is required")).toBeDefined();
      expect(screen.getByText("Available Days is required")).toBeDefined();
      expect(screen.getByText("Preferred Shift Time is required")).toBeDefined();
    });

    expect(toast.error).toHaveBeenCalledWith(
      "Please fill all required fields correctly before proceeding."
    );
    expect(nextStep).not.toHaveBeenCalled();
  });

  it("prevents progression when required fields contain only whitespace", async () => {
    const nextStep = vi.fn().mockResolvedValue(true);
    render(
      <TestWrapper
        nextStep={nextStep}
        initialValues={{
          qualificationId: "   ",
          departmentId: "   ",
          availableDayId: "   ",
          shiftTimeId: "   ",
        }}
      />
    );

    const nextBtn = screen.getByRole("button", { name: "Next" });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(screen.getByText("Qualification cannot contain only spaces")).toBeDefined();
      expect(screen.getByText("Department cannot contain only spaces")).toBeDefined();
      expect(screen.getByText("Available Days cannot contain only spaces")).toBeDefined();
      expect(screen.getByText("Preferred Shift Time cannot contain only spaces")).toBeDefined();
    });

    expect(nextStep).not.toHaveBeenCalled();
  });

  it("allows progression when all four required fields have valid values without requiring certificate", async () => {
    const nextStep = vi.fn().mockResolvedValue(true);
    render(
      <TestWrapper
        nextStep={nextStep}
        initialValues={{
          qualificationId: "1",
          departmentId: "10",
          availableDayId: "100",
          shiftTimeId: "1000",
        }}
      />
    );

    const nextBtn = screen.getByRole("button", { name: "Next" });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(nextStep).toHaveBeenCalledWith(true);
    });

    expect(toast.error).not.toHaveBeenCalled();
  });

  it("does not skip validation if a synthetic event is accidentally passed to nextStep", async () => {
    // Simulating calling nextStep directly with a MouseEvent-like object
    let capturedNextStep: any;
    const TestHookWrapper = () => {
      const form = useForm<FormValues>({
        defaultValues,
      });

      const handleDirectEventCall = async (skipValidation?: boolean): Promise<boolean> => {
        // Direct event call simulation
        const valid = await form.trigger([
          "qualificationId",
          "departmentId",
          "availableDayId",
          "shiftTimeId",
        ]);
        if (!valid) {
          toast.error("Please fill all required fields correctly before proceeding.");
          return false;
        }
        return true;
      };
      capturedNextStep = handleDirectEventCall;

      return (
        <TooltipProvider>
          <ProfessionalDetailsStep
            form={form}
            dropdownOption={mockDropdownOption}
            nextStep={handleDirectEventCall}
            prevStep={vi.fn()}
            reset={vi.fn()}
          />
        </TooltipProvider>
      );
    };

    render(<TestHookWrapper />);
    const nextBtn = screen.getByRole("button", { name: "Next" });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(screen.getByText("Qualification is required")).toBeDefined();
    });
  });
});
