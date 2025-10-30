import React from "react";
import { StepperProps } from "../type";

export const Stepper: React.FC<StepperProps> = ({
    steps,
    currentStep,
    onStepClick,
}) => {
    return (
        <div className="relative flex justify-between items-center mb-12 px-4">
            {/* The base line behind the steps */}
            <div className="absolute top-6 inset-x-0 h-1 bg-gray-200 rounded-full">
                <div
                    className="h-1 bg-gradient-to-r from-blue-600 via-green-500 to-teal-500 rounded-full transition-all duration-500"
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
                        className="flex flex-col items-center relative z-10"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                onStepClick && isActiveOrCompleted && onStepClick(step.id)
                            }
                            className={`w-12 h-12 flex items-center justify-center rounded-full font-semibold ${isActiveOrCompleted
                                    ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md"
                                    : "bg-gray-200 text-gray-600"
                                }`}
                        >
                            {step.id}
                        </button>
                        <span className="mt-3 text-sm font-medium text-gray-700">
                            {step.title}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
