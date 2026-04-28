"use client";

import React from "react";
import Link from "next/link";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  FileText,
  LayoutDashboard,
  Navigation2,
  RefreshCw,
  Settings2,
  ShieldAlert,
  User as UserIcon,
} from "lucide-react";
import { getClientAuth, isFirebaseConfigured } from "@/lib/firebase";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authResolved, setAuthResolved] = React.useState(!isFirebaseConfigured);
  const [currentUser, setCurrentUser] = React.useState<FirebaseUser | null>(null);

  React.useEffect(() => {
    const auth = getClientAuth();
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthResolved(true);

      if (!user) {
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!isFirebaseConfigured) {
    return <>{children}</>;
  }

  if (!authResolved || !currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-900 text-brand-gray-2">
        Checking secure session...
      </div>
    );
  }

  const displayName = currentUser.displayName || "Maritime Officer";
  const accessLabel = currentUser.email || "Captain Access";

  const navItems = [
    { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Route Analyzer", icon: Navigation2, href: "/analyzer" },
    { name: "Threat Intel", icon: ShieldAlert, href: "/threats" },
    { name: "LLM Briefings", icon: FileText, href: "/briefings" },
    { name: "Settings", icon: Settings2, href: "/settings" },
  ];

  const currentPageName = navItems.find((item) => item.href === pathname)?.name || "Dashboard";

  return (
    <div className="flex min-h-screen bg-navy-900 text-brand-gray-1">
      <aside className="fixed left-0 top-0 z-40 flex h-full w-[220px] flex-col border-r border-navy-600 bg-navy-800">
        <div className="p-6 pb-4">
          <Link href="/" className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 1 L18 5.5 L18 14.5 L10 19 L2 14.5 L2 5.5 Z" stroke="#1D9E75" strokeWidth="1.5" />
            </svg>
            <span className="text-[15px] font-semibold tracking-tight text-brand-gray-1">ChainGuard</span>
          </Link>
          <div className="mt-3 inline-block rounded-full border border-teal-500 bg-navy-700 px-2 py-0.5 font-mono text-[10px] text-teal-500">
            v4.0
          </div>
        </div>

        <nav className="mt-6 flex-1 space-y-0.5 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "border-l-[3px] border-l-teal-500 bg-navy-700 text-brand-gray-1"
                    : "text-brand-gray-2 hover:bg-navy-700 hover:text-brand-gray-1"
                }`}
              >
                <item.icon size={16} className={isActive ? "text-teal-500" : "text-brand-gray-3"} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-navy-600 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-700">
              <UserIcon size={14} className="text-teal-500" />
            </div>
            <div className="overflow-hidden">
              <div className="truncate text-sm font-medium text-brand-gray-1">{displayName}</div>
              <div className="truncate text-xs text-brand-gray-2">{accessLabel}</div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-1.5 w-1.5 animate-[pulse-dot_2s_infinite] rounded-full bg-teal-500" />
            <span className="font-mono text-[10px] tracking-widest text-teal-500">OPTIMAL</span>
          </div>
        </div>
      </aside>

      <header className="fixed left-[220px] right-0 top-0 z-30 flex h-14 items-center justify-between border-b border-navy-600 bg-navy-900 px-6">
        <div className="text-base font-semibold text-brand-gray-1">{currentPageName}</div>
        <div className="flex items-center gap-4">
          <button title="Refresh data">
            <RefreshCw size={16} className="cursor-pointer text-brand-gray-2 transition hover:text-brand-gray-1" />
          </button>
          <div className="group relative cursor-pointer">
            <Bell size={16} className="text-brand-gray-2 transition group-hover:text-brand-gray-1" />
            <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 font-mono text-[9px] text-white">
              4
            </div>
          </div>
          <Link
            href="/analyzer"
            className="rounded-xl bg-teal-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal-400"
          >
            Analyze Route &rarr;
          </Link>
        </div>
      </header>

      <main className="ml-[220px] mt-[56px] min-h-[calc(100vh-56px)] w-full bg-navy-900 p-6">{children}</main>
    </div>
  );
}
