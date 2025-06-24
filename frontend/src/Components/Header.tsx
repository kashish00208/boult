import React from "react";

const Header: React.FC = () => {
  return (
    <header className="w-screen bg-black/80 backdrop-blur-sm border-b border-gray-200 fixed top-0 z-50 px-5 py-4">
      <div className="px-2 py-2 flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-white text-accent bg-clip-text ">
              builder.ai
            </h1>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 hidden md:flex ">
          Create websites with AI prompts
        </p>

        <nav className="items-center space-x-6">
          <button
            className="bg-blue-500 rounded-md items-center justify-center px-3 py-1.5 text-xs  text-bolt-elements-button-primary-text outline-accent-500 flex gap-1.7"
            type="button"
          >
            Sign Up
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
