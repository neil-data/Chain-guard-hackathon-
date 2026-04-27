"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "./ui/Skeleton";

// The height needs to be consistent to prevent layout shift
const Globe3D = dynamic(() => import("./Globe3D"), {
  ssr: false,
  loading: () => (
    <div className="relative flex flex-col items-center justify-center w-full rounded-2xl border border-navy-600 bg-navy-800/60" style={{ height: 400 }}>
      {/* Fallback spinner to match skeleton spec */}
      <div className="animate-spin text-teal-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      </div>
      <p className="mt-3 font-mono text-[11px] text-brand-gray-3">Loading route map</p>
    </div>
  ),
});

export default Globe3D;
