import React from "react";
import { Montserrat } from "next/font/google";
import Image from "next/image";

const montserrat = Montserrat({ subsets: ["latin"], weight: "800" });

const NavBar = () => {
  return (
    <div className="flex items-center justify-between px-8 py-4 shadow-md sticky top-0 z-50 mt-1 border-b-1 border-slate-700">
      <div className={`text-3xl font-extrabold tracking-wide text-white ${montserrat.className}`}>
        Builder<span className="text-purple-400">.ai</span>
      </div>
      <a
        href="https://github.com/kashish00208/boult"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-5 py-2 bg-purple-700 text-white font-semibold rounded-full hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        <p>Star on GitHub</p>
        <Image
          src="/github.webp"
          width={28}
          height={28}
          className="rounded-full"
          alt="GitHub icon"
        />
      </a>
    </div>
  );
};

export default NavBar;
