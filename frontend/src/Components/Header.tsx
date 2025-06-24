import React from 'react';
import { Code, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-screen mr-0 bg-black/70 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 py-4 flex items-center justify-between max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Website Builder
            </h1>
            <p className="text-sm text-gray-400">Create websites with AI prompts</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
            Sign Up
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
