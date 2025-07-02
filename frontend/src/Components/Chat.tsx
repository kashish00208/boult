export default function ChatPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 text-white min-h-screen">
      <div className="text-center max-w-xl mb-10">
        <h1 className="text-3xl font-semibold mb-4">What do you want to build?</h1>
        <p className="text-white text-lg">
          Create stunning and functional websites in minutes just by some prompts.
        </p>
      </div>

      <form className="w-full max-w-xl">
        <textarea
        rows={5}
          placeholder="Describe your idea..."

          className="w-full px-6 py-4 rounded-xl border border-gray-700 shadow-sm focus:ring-2 focus:ring-black text-base"
        />
      </form>
    </div>
  );
}

