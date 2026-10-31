
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export default function GlassCard({
  children,
  className = "",
  padding = "md",
}: GlassCardProps) {
  const paddingStyles = {
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6",
    lg: "p-5 sm:p-8",
  };

  return (
    <div
      className={`
        rounded-2xl
        border border-white/80
        bg-white/70
        backdrop-blur-2xl
        shadow-[0_8px_30px_rgba(30,64,175,0.07)]
        transition-all duration-300
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
