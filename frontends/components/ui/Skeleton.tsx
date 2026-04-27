import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  shimmer?: boolean;
}

export function Skeleton({ className, shimmer = true }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-brand-subtle/40 rounded animate-pulse",
        shimmer &&
          "relative overflow-hidden after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-brand-white/[0.04] after:to-transparent after:-translate-x-full animate-[shimmer_2s_infinite]",
        className
      )}
    />
  );
}
