import React, { ReactNode } from "react";

interface DashboardLayoutProps {
  title?: string;
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans pt-6 md:pt-6 lg:pt-6">
      <main className="flex-1 mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-6">
        {title && (
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
};
