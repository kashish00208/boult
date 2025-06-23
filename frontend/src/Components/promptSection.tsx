import React from 'react';

const PromptSection = () => {
  return (
    <div className="w-screen h-screen bg-gradient-to-r from-black to-slate-900 flex flex-col items-center justify-center text-white px-4">
      <h1 className="text-5xl font-bold mb-4 text-center ">
        What do you want to build?
      </h1>
      <p className="text-xl mb-6 text-center">
        Create stunning website UI by chatting with AI
      </p>

      <div className="w-full max-w-md flex flex-col gap-4">
        <textarea
          name="input"
          id="input"
          rows={5}
          placeholder="Enter your idea..."
          className="p-3 rounded-md text-black placeholder-gray-500 border-2 border-gray-700 bg-gray-900"
        ></textarea>
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition">
          Generate UI
        </button>
      </div>
    </div>
  );
};

export default PromptSection;
