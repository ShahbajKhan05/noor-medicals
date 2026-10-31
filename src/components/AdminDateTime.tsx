"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";

type ClockData = {
  date: string;
  time: string;
};

export default function AdminDateTime() {
  const [clock, setClock] = useState<ClockData>({
    date: "",
    time: "",
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      setClock({
        date: now.toLocaleDateString("en-IN", {
          timeZone: "Asia/Kolkata",
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        }),

        time: now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      });
    };

    updateClock();

    const interval = window.setInterval(updateClock, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-600 shadow-sm">
        <CalendarDays size={16} className="text-blue-600" />
        <span>{clock.date || "Loading date..."}</span>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-600 shadow-sm">
        <Clock size={16} className="text-cyan-600" />
        <span>{clock.time || "Loading time..."}</span>
        <span className="font-semibold text-blue-700">IST</span>
      </div>
    </div>
  );
}