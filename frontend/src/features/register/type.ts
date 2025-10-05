export type City = { id: string; name: string };

export interface Step {
    id: number;
    title: string;
}

export interface StepperProps {
    steps: Step[];
    currentStep: number;
    onStepClick?: (step: number) => void;
}

