"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export const StartButton: React.FC<{ label?: string }> = ({
  label = "Begin Journey",
}) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative group">
        <Link href="/public">
          <button
            className="relative inline-block p-px font-semibold leading-6 text-white 
                       bg-neutral-900 shadow-2xl cursor-pointer rounded-lg 
                       shadow-emerald-900 transition-all duration-300 ease-in-out 
                       hover:scale-105 active:scale-95 hover:shadow-emerald-600"
          >
            <span
              className="absolute inset-0 rounded-lg bg-gradient-to-r 
                         from-emerald-500 via-cyan-500 to-sky-600 
                         p-[2px] opacity-0 transition-opacity duration-500 
                         group-hover:opacity-100"
            ></span>

            <span className="relative z-10 block px-6 py-2 rounded-lg bg-neutral-950">
              <div className="relative z-10 flex items-center space-x-3 text-base sm:text-lg">
                <span
                  className="transition-all duration-500 
                                 group-hover:translate-x-1.5 
                                 group-hover:text-emerald-300"
                >
                  {label}
                </span>
                <ArrowRight className="transition-all duration-500 group-hover:translate-x-1 group-hover:text-emerald-300" />
              </div>
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
};
