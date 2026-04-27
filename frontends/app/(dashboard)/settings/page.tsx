"use client";

import React from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { auth } from "@/lib/firebase";

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("captain@shipping.com");
  const [role, setRole] = React.useState("Maritime Officer");
  const [signingOut, setSigningOut] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      setEmail(user.email || "captain@shipping.com");

      const providerId = user.providerData[0]?.providerId;

      if (providerId === "google.com") {
        setRole("Google Account");
      } else if (providerId === "github.com") {
        setRole("GitHub Account");
      } else if (providerId === "password") {
        setRole("Email Account");
      } else {
        setRole("Maritime Officer");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      await signOut(auth);
      toast.success("Signed out.");
      router.replace("/login");
    } catch {
      toast.error("Unable to sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl pb-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-brand-gray-1">Settings</h2>
        <div className="mt-1 text-sm text-brand-gray-2">Manage your account and platform preferences.</div>
      </div>

      <div className="mt-8 space-y-6">
        <div className="rounded-2xl border border-navy-600 bg-navy-800 p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-brand-gray-1">
            <Settings size={16} className="text-teal-500" /> Account
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-brand-gray-2">Email</label>
              <input
                disabled
                type="text"
                value={email}
                readOnly
                className="w-full max-w-sm cursor-not-allowed rounded-xl border border-navy-600 bg-[var(--color-terminal-bg)] px-4 py-3 text-sm text-brand-gray-1 opacity-60"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-brand-gray-2">Role</label>
              <input
                disabled
                type="text"
                value={role}
                readOnly
                className="w-full max-w-sm cursor-not-allowed rounded-xl border border-navy-600 bg-[var(--color-terminal-bg)] px-4 py-3 text-sm text-brand-gray-1 opacity-60"
              />
            </div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="mt-6 flex items-center gap-2 text-sm font-medium text-red-500 transition hover:text-red-500/80"
          >
            <LogOut size={16} /> {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}