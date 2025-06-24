import React from "react";

const ChatCodePage = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-stretch w-full h-screen bg-gray-900 text-white p-5 gap-5 overflow-hidden mt-15">
      <section className="ChatSection bg-gray-800 w-full md:w-1/2 h-full rounded-xl p-2 shadow-inner">
        Chat Section
      </section>

      <section className="CodeSection bg-gray-800 w-full md:w-1/2 h-full rounded-xl p-2 shadow-inner">
        Code Section
      </section>
    </div>
  );
};

export default ChatCodePage;
