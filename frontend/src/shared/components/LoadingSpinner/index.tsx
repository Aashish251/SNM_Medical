import Spinner from "@shared/components/ui/spinner";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner size="lg" color="blue" />
    </div>
  );
};

export default LoadingSpinner;
