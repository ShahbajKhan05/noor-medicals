
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color?: "blue" | "green" | "teal" | "purple" | "red";
}

export default function ServiceCard({
  title,
  description,
  icon: Icon,
  href,
  color = "blue",
}: ServiceCardProps) {
  const colors = {
    blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-600",
    green: "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500",
    teal: "bg-cyan-100 text-cyan-600 group-hover:bg-cyan-600",
    purple: "bg-violet-100 text-violet-600 group-hover:bg-violet-600",
    red: "bg-rose-100 text-rose-600 group-hover:bg-rose-600",
  };

  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-white/80 bg-white/75 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300 group-hover:text-white ${colors[color]}`}
        >
          <Icon size={24} />
        </div>

        <ArrowUpRight
          size={20}
          className="text-slate-400 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
        />
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </Link>
  );
}
