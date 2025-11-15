import React from "react";
import { StepperProps } from "../../../features/register/type";

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  const percent =
    steps.length > 1 ? ((currentStep - 1) / (steps.length - 1)) * 100 : 0;
  return (
    <div className="relative flex justify-between items-center mb-12 px-4">
      {/* The base line behind the steps */}
      <div className=" mx-auto w-full absolute top-6 inset-x-0 h-1 bg-gray-200 rounded-full lg:max-w-5xl md:max-w-4xl sm:max-w-3xl max-w-xs">
        <div
          className="h-1 bg-to-two-right-theme-gradient rounded-full transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        ></div>
      </div>

      {/* The step circles and labels */}
      {steps.map((step) => {
        const isActiveOrCompleted = currentStep >= step.id;
        return (
          <div
            key={step.id}
            className="flex flex-col items-center relative z-10 min-w-[60px] sm:min-w-[80px]"
          >
            <button
              type="button"
              onClick={() =>
                onStepClick && isActiveOrCompleted && onStepClick(step.id)
              }
              className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full font-semibold transition-colors duration-300 ${
                isActiveOrCompleted
                  ? "bg-to-two-right-theme-gradient text-white shadow-md hover:shadow-lg"
                  : "bg-gray-200 text-gray-600"
              }`}
              aria-current={isActiveOrCompleted ? "step" : undefined}
              aria-label={`Step ${step.id}: ${step.title}`}
            >
              {step.id}
            </button>
            <span className="mt-3 text-xs sm:text-sm font-medium bg-to-two-right-theme-gradient bg-clip-text text-transparent text-center whitespace-nowrap">
              {step.title}
            </span>
          </div>
        );
      })}
    </div>
  );
};
