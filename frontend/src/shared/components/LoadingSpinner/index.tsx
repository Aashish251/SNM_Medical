const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-25 w-25 border-b-2 border-purple-600 mx-auto mb-4"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
