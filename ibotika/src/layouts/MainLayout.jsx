import React from 'react';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Align content to the left */}
            <div className="flex items-center p-[50px]">
              {/* Make the logo smaller */}
              <img src="/iBotikaPluslogo.png" alt="iBotika Plus Logo" className="h-5 w-auto" />
            </div>
            {/* Move the text to the right */}
            <div className="ml-auto">
              <span className="text-2xl font-bold text-gray-900"></span>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
