import React from 'react';

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {children}
      </div>
    </div>
  );
};

export default layout;
