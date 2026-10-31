
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  Heart,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Appointments", href: "/appointments" },
  { label: "Lab Tests", href: "/lab-tests" },
  { label: "Home Collection", href: "/home-collection" },
  { label: "My Reports", href: "/reports" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h2 className="text-xl font-extrabold text-blue-700">
            Swastik Clinic
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Your trusted healthcare partner in Rewa, Madhya Pradesh.
            Quality healthcare with care and compassion.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-slate-900">Quick Links</h3>
          <ul className="mt-4 space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-slate-500 transition hover:text-blue-600"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-slate-900">Contact Us</h3>

          <div className="mt-4 space-y-4 text-sm text-slate-500">
            <p className="flex items-start gap-3">
              <MapPin size={18} className="shrink-0 text-blue-600" />
              Rewa, Madhya Pradesh, India
            </p>

            <p className="flex items-center gap-3">
              <Phone size={18} className="text-emerald-600" />
              Contact number to be updated
            </p>

            <p className="flex items-center gap-3">
              <Clock size={18} className="text-violet-600" />
              Clinic timings to be updated
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 px-5 py-5 text-center">
        <p className="flex flex-wrap items-center justify-center gap-1 text-xs text-slate-500">
          ©Swastik Clinic. Made with
          <Heart size={13} className="fill-rose-500 text-rose-500" />
          for better healthcare.
        </p>
      </div>
    </footer>
  );
}
