
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "success" | "teal" | "purple" | "outline";
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200",
    success: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200",
    teal: "bg-cyan-600 text-white hover:bg-cyan-700 shadow-cyan-200",
    purple: "bg-violet-600 text-white hover:bg-violet-700 shadow-violet-200",
    outline: "border border-slate-300 bg-white/70 text-slate-700 hover:bg-slate-100",
  };

  return (
    <button
      className={`
        inline-flex min-h-11 items-center justify-center gap-2
        rounded-xl px-5 py-2.5 text-sm font-semibold
        transition-all duration-200
        active:scale-95 disabled:cursor-not-allowed disabled:opacity-50
        ${variants[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
