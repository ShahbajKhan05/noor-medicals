
import {
  ArrowRight,
  CalendarDays,
  FlaskConical,
  HeartPulse,
  Home,
  FileText,
  ShieldCheck,
  Stethoscope,
  Clock,
  Activity,
  ChevronRight,
  Star,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";

const services = [
  {
    title: "Appointments",
    description: "Book a doctor visit",
    icon: CalendarDays,
    color: "blue" as const,
    href: "/appointments",
  },
  {
    title: "Pathology Lab",
    description: "Book your lab tests",
    icon: FlaskConical,
    color: "teal" as const,
    href: "/lab-tests",
  },
  {
    title: "Home Collection",
    description: "Sample at your home",
    icon: Home,
    color: "green" as const,
    href: "/home-collection",
  },
  {
    title: "My Reports",
    description: "View and download",
    icon: FileText,
    color: "purple" as const,
    href: "/reports",
  },
];

const highlights = [
  {
    icon: Stethoscope,
    title: "Doctor Care",
    subtitle: "Professional care",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Activity,
    title: "Lab Services",
    subtitle: "Reliable testing",
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    icon: HeartPulse,
    title: "Family Health",
    subtitle: "Care for everyone",
    color: "bg-rose-100 text-rose-600",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-3 pb-28 pt-3 sm:px-6 sm:pb-8 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* NAVBAR */}
        <Navbar />

        {/* HERO SECTION */}
        <section className="mt-5 grid items-center gap-5 lg:mt-8 lg:grid-cols-2 lg:gap-10">

          <div className="glass-card relative overflow-hidden p-5 sm:p-8 lg:border-0 lg:bg-transparent lg:shadow-none">
            <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-blue-200/50 blur-3xl" />

            <div className="relative">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-2 text-xs font-bold text-blue-700 sm:text-sm">
                <ShieldCheck size={16} />
                Your Trusted Healthcare Partner
              </div>

              <h2 className="text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
                Your Health,
                <span className="block text-blue-600">
                  Our Priority.
                </span>
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                Quality healthcare, doctor appointments and reliable
                pathology services — all in one place for you and your family.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/appointments"
                  className="primary-button w-full sm:w-auto"
                >
                  Book Appointment <ArrowRight size={17} />
                </a>

                <a
                  href="#services"
                  className="secondary-button w-full sm:w-auto"
                >
                  Explore Services
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-slate-500 sm:text-sm">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={17} className="text-emerald-600" />
                  Patient Friendly
                </span>

                <span className="flex items-center gap-2">
                  <Clock size={17} className="text-blue-600" />
                  Easy Booking
                </span>
              </div>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="glass-card relative overflow-hidden p-4 sm:p-7">
            <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full bg-cyan-200/60 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-52 w-52 rounded-full bg-blue-200/60 blur-3xl" />

            <div className="relative rounded-3xl bg-gradient-to-br from-blue-100 via-white to-cyan-100 p-5 sm:p-9">
              <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border-8 border-white/70 bg-white/70 shadow-xl sm:h-56 sm:w-56">
                <Stethoscope
                  size={90}
                  strokeWidth={1.3}
                  className="text-blue-600 sm:h-28 sm:w-28"
                />
              </div>

              <div className="glass-card mt-5 flex items-center gap-3 p-4">
                <div className="rounded-xl bg-rose-100 p-3 text-rose-600">
                  <HeartPulse size={25} />
                </div>

                <div>
                  <h3 className="text-sm font-bold sm:text-base">
                    Care for Every Family
                  </h3>

                  <p className="text-xs text-slate-500 sm:text-sm">
                    Healthcare made simple.
                  </p>
                </div>

                <div className="ml-auto text-amber-400">
                  <Star size={20} fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK SERVICES */}
        <section id="services" className="mt-9 scroll-mt-24 sm:mt-12">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold tracking-widest text-blue-600">
                HEALTHCARE SERVICES
              </p>

              <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                What do you need?
              </h2>

              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Choose a service to get started.
              </p>
            </div>

            <a
              href="#contact"
              className="flex shrink-0 items-center gap-1 text-xs font-bold text-blue-600 sm:text-sm"
            >
              View all <ChevronRight size={16} />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {services.map((service) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                icon={service.icon}
                color={service.color}
                href={service.href}
              />
            ))}
          </div>
        </section>

        {/* TRUST SECTION */}
        <section className="mt-9 sm:mt-12">
          <div className="mb-4">
            <p className="text-xs font-bold tracking-widest text-emerald-600">
              WHY SWASTIK CLINIC
            </p>

            <h2 className="mt-1 text-2xl font-extrabold">
              Care you can trust.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="glass-card flex items-center gap-4 p-4"
                >
                  <div className={`rounded-2xl p-3 ${item.color}`}>
                    <Icon size={23} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ABOUT */}
        <section
          id="about"
          className="glass-card mt-9 grid gap-4 p-5 sm:mt-12 sm:grid-cols-2 sm:p-8"
        >
          <div>
            <p className="text-xs font-bold tracking-widest text-blue-600">
              ABOUT OUR CLINIC
            </p>

            <h2 className="mt-2 text-2xl font-extrabold">
              Healthcare with care and trust.
            </h2>
          </div>

          <p className="text-sm leading-7 text-slate-600">
            Swastik Clinic aims to make healthcare services easier to access.
            Patients can explore clinic services, request appointments and
            access pathology-related services through one convenient platform.
          </p>
        </section>

        {/* FOOTER */}
        <div id="contact">
          <Footer />
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="glass-panel fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 border-t border-white/80 px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 shadow-[0_-5px_25px_rgba(15,23,42,0.08)] md:hidden">
        {[
          { label: "Home", icon: Home, href: "/" },
          { label: "Appointments", icon: CalendarDays, href: "/appointments" },
          { label: "Lab Tests", icon: FlaskConical, href: "/lab-tests" },
          { label: "Reports", icon: FileText, href: "/reports" },
        ].map((item, index) => {
          const Icon = item.icon;

          return (
            <a
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-1 text-[10px] font-semibold ${
                index === 0 ? "text-blue-600" : "text-slate-500"
              }`}
            >
              <Icon size={21} />
              {item.label}
            </a>
          );
        })}
      </nav>
    </main>
  );
}
