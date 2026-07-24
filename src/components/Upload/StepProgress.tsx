interface StepProgressProps {
  totalSteps: number;
  currentStep: number; // 1-indexed
}

const StepProgress: React.FC<StepProgressProps> = ({ totalSteps, currentStep }) => {
  return (
    <div className="flex gap-1.5 px-5 py-4">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <span
          key={step}
          className={`h-1 flex-1 rounded-full ${step <= currentStep ? 'bg-primary' : 'bg-gray-200'}`}
        />
      ))}
    </div>
  );
};

export default StepProgress;
