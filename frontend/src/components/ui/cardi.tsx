"use client";
import React from "react";

interface CardIProps {
  name: string;
  projects: number;
  availability: number;
  contributions: number;
}

export default function CardI({
  name,
  projects,
  availability,
  contributions,
}: CardIProps) {
  return (
    <div className="group relative w-full rounded-2xl bg-background overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(56,189,248,0.6)]">

      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-800 opacity-0 blur-md group-hover:opacity-60 transition-opacity duration-700"></div>

      <div className="relative z-10 p-[5px] rounded-2xl bg-gray-900 shadow-[0_7px_20px_rgba(100,100,111,0.2)] backdrop-blur">

        <div className="relative flex flex-col h-[150px] rounded-[15px] bg-gradient-to-tr from-cyan-700 via-sky-500 to-cyan-300 overflow-hidden">

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_70%)] opacity-40 group-hover:opacity-70 transition-opacity duration-700"></div>

          <div className="relative w-[130px] h-[30px] bg-background skew-x-[-40deg] shadow-[-10px_-10px_0_0_#1b233d] rounded-br-[10px]">
            <div className="absolute top-0 right-[-15px] w-[15px] h-[15px] bg-transparent rounded-tl-[10px] shadow-[-5px_-5px_0_2px_#1b233d]" />
          </div>

          <div className="absolute top-[30px] left-0 w-[15px] h-[15px] bg-transparent rounded-tl-[15px] shadow-[-5px_-5px_0_2px_#1b233d]" />

          <div className="absolute top-0 w-full h-[30px] flex justify-between">
            <div className="h-full aspect-square p-[7px_0_7px_15px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 94 94"
                className="h-full fill-white opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              >
                <path d="M38.0481 4.82927C38.0481 2.16214 40.018 0 42.4481 0H51.2391C53.6692 0 55.6391 2.16214 55.6391 4.82927V40.1401C55.6391 48.8912 53.2343 55.6657 48.4248 60.4636C43.6153 65.2277 36.7304 67.6098 27.7701 67.6098C18.8099 67.6098 11.925 65.2953 7.11548 60.6663C2.37183 56.0036 0 49.2967 0 40.5456V4.82927C0 2.16213 1.96995 0 4.4 0H13.2405C15.6705 0 17.6405 2.16214 17.6405 4.82927V39.1265C17.6405 43.7892 18.4805 47.2018 20.1605 49.3642C21.8735 51.5267 24.4759 52.6079 27.9678 52.6079C31.4596 52.6079 34.0127 51.5436 35.6268 49.4149C37.241 47.2863 38.0481 43.8399 38.0481 39.0758V4.82927Z" />
                <path d="M86.9 61.8682C86.9 64.5353 84.9301 66.6975 82.5 66.6975H73.6595C71.2295 66.6975 69.2595 64.5353 69.2595 61.8682V4.82927C69.2595 2.16214 71.2295 0 73.6595 0H82.5C84.9301 0 86.9 2.16214 86.9 4.82927V61.8682Z" />
                <path d="M0 83.2195C0 80.5524 1.96995 78.3902 4.4 78.3902H83.6C86.0301 78.3902 88 80.5524 88 83.2195V89.1707C88 91.8379 86.0301 94 83.6 94H4.4C1.96995 94 0 91.8379 0 89.1707V83.2195Z" />
              </svg>
            </div>

            <div className="h-full flex gap-2 p-[8px_15px]">
              {[
                "M 9.9980469 3 C 6.1390469 3 3 6.1419531 3 10.001953...",
                "M459.37 151.716c.325 4.548...",
                "M524.531,69.836a1.5,1.5,0,0,0-.764-.7...",
              ].map((d, i) => (
                <svg
                  key={i}
                  viewBox="0 0 30 30"
                  className="h-full fill-[#1b233d] hover:fill-white transition-colors duration-300"
                >
                  <path d={d} />
                </svg>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 text-center">
          <span className="block text-[18px] font-bold text-white tracking-[1.5px] group-hover:text-cyan-300 transition-colors duration-300">
            {name}
          </span>

          <div className="flex justify-between mt-4 text-[10px] text-[#aadff3b8]">
            <div className="flex flex-col items-center flex-1">
              <span className="text-[13px] font-semibold text-white">
                {projects}
              </span>
              <span>Projects</span>
            </div>
            <div className="flex flex-col items-center flex-1 border-x border-white/10">
              <span className="text-[13px] font-semibold text-white">
                {availability}%
              </span>
              <span>Availability</span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-[13px] font-semibold text-white">
                {contributions.toLocaleString()}
              </span>
              <span>Contributions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
