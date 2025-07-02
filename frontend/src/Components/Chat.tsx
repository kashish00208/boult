import { FaArrowRight } from "react-icons/fa";

export default function ChatPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 mt-28 text-white">
      <div className="text-center max-w-xl mb-10">
        <h1 className="text-4xl font-semibold mb-4">What do you want to build?</h1>
        <p className="text-white text-sm">
          Create stunning and functional websites in minutes just by some prompts.
        </p>
      </div>

      <form className="w-full max-w-xl relative">
        {/* Container with relative positioning */}
        <div className="relative">
          <textarea
            rows={5}
            placeholder="Describe your idea..."
            className="w-full px-6 py-4 pr-14 rounded-xl border border-gray-700 shadow-sm focus:ring-2 "
          />
          {/* Button absolutely positioned at bottom-right */}
          <button
            type="submit"
            className="absolute top-3 right-4  hover:text-blue-600 transition-colors"
          >
            <FaArrowRight size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
