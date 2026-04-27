"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Chrome, Eye, EyeOff, Github, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import toast from "react-hot-toast";
import DynamicGlobe from "@/components/DynamicGlobe";
import { auth, initAnalytics } from "@/lib/firebase";
import { gsap } from "@/lib/gsap";

function getAuthErrorMessage(error: unknown, provider: "email" | "google" | "github"): string {
  if (!(error instanceof FirebaseError)) {
    return "Authentication failed. Please try again.";
  }

  switch (error.code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Switch to Sign In mode.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/account-exists-with-different-credential":
      return "This email is already linked to another sign-in method.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completion.";
    case "auth/popup-blocked":
      return "Popup was blocked. Allow popups and try again, or continue with redirect.";
    case "auth/operation-not-allowed":
      if (provider === "email") {
        return "Email/Password auth is disabled. Enable it in Firebase Authentication settings.";
      }

      if (provider === "github") {
        return "GitHub auth is disabled. Enable GitHub provider in Firebase Authentication settings.";
      }

      return "Google auth is disabled. Enable Google provider in Firebase Authentication settings.";
    case "auth/unauthorized-domain":
      return "Current domain is not authorized. Add this domain in Firebase Authentication authorized domains.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait and try again.";
    default:
      return "Authentication failed. Please try again.";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [emailMode, setEmailMode] = React.useState<"signin" | "signup">("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [authAction, setAuthAction] = React.useState<"credentials" | "google" | "github" | null>(null);

  const isLoading = authAction !== null;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".form-item", {
        y: 16,
        opacity: 0,
        duration: 0.5,
        stagger: 0.07,
        ease: "power2.out",
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    void initAnalytics();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isLoading) return;

    if (emailMode === "signup" && password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setAuthAction("credentials");

    try {
      if (emailMode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success("Account created and signed in.");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Signed in successfully.");
      }

      router.push("/dashboard");
    } catch (error) {
      if (error instanceof FirebaseError && emailMode === "signin") {
        if (error.code === "auth/user-not-found") {
          setEmailMode("signup");
          toast.error("No account found for this email. Switched to Create Account mode.");
          return;
        }

        if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
          try {
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);

            if (signInMethods.length === 0) {
              setEmailMode("signup");
              toast.error("No account found for this email. Switched to Create Account mode.");
              return;
            }

            toast.error("Incorrect password. Please try again.");
            return;
          } catch {
            // Fall through to generic message.
          }
        }
      }

      if (error instanceof FirebaseError && emailMode === "signup" && error.code === "auth/email-already-in-use") {
        setEmailMode("signin");
      }

      toast.error(getAuthErrorMessage(error, "email"));
    } finally {
      setAuthAction(null);
    }
  };

  const runPopupProviderSignIn = async (
    provider: GoogleAuthProvider | GithubAuthProvider,
    providerType: "google" | "github",
    successMessage: string,
  ) => {
    if (isLoading) return;

    setAuthAction(providerType);

    try {
      await signInWithPopup(auth, provider);
      toast.success(successMessage);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof FirebaseError && error.code === "auth/popup-blocked") {
        toast("Popup blocked. Redirecting to continue sign-in...");
        await signInWithRedirect(auth, provider);
        return;
      }

      toast.error(getAuthErrorMessage(error, providerType));
    } finally {
      setAuthAction(null);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await runPopupProviderSignIn(provider, "google", "Signed in with Google.");
  };

  const handleGithubSignIn = async () => {
    const provider = new GithubAuthProvider();
    provider.addScope("read:user");
    provider.addScope("user:email");
    await runPopupProviderSignIn(provider, "github", "Signed in with GitHub.");
  };

  return (
    <div className="grid min-h-screen grid-cols-1 bg-navy-900 text-brand-gray-1 lg:grid-cols-2">
      <div className="hidden flex-col justify-between border-r border-navy-600 bg-navy-900 p-12 lg:flex">
        <div className="flex items-center">
          <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1 L18 5.5 L18 14.5 L10 19 L2 14.5 L2 5.5 Z" stroke="#1D9E75" strokeWidth="1.5" />
          </svg>
          <span className="ml-3 text-lg font-semibold tracking-tight">ChainGuard</span>
        </div>

        <div className="w-full">
          <DynamicGlobe height={320} showRoutes showThreats interactive autoRotate />
          <div className="mt-6 space-y-2 font-mono text-xs">
            <div className="text-teal-500">&gt; System status: OPTIMAL</div>
            <div className="text-amber-500">&gt; Route MUMBAI - ROTTERDAM: MEDIUM</div>
            <div className="text-red-500">&gt; 4 verified threats active</div>
            <div className="text-brand-gray-3">&gt; Last crawl: 2 minutes ago</div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-gray-1">Predictive risk. Resilient supply.</h2>
          <div className="mt-3 font-mono text-[11px] text-brand-gray-3">Hackathon 2026 . ChainGuard v4.0</div>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center bg-navy-800 p-8">
        <div className="w-full max-w-[380px]">
          <div className="mb-8 flex items-center lg:hidden">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 1 L18 5.5 L18 14.5 L10 19 L2 14.5 L2 5.5 Z" stroke="#1D9E75" strokeWidth="1.5" />
            </svg>
            <span className="ml-3 text-lg font-semibold tracking-tight">ChainGuard</span>
          </div>

          <h1 className="form-item text-3xl font-bold tracking-tight text-brand-gray-1">Welcome back.</h1>
          <p className="form-item mb-10 mt-2 text-sm text-brand-gray-2">
            {emailMode === "signin" ? "Sign in to your intelligence dashboard." : "Create your account to access the dashboard."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-item">
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-brand-gray-2">Email</label>
              <input
                type="email"
                placeholder="captain@shipping.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isLoading}
                required
                autoComplete="email"
                className="w-full rounded-xl border border-navy-600 bg-[var(--color-terminal-bg)] px-4 py-3.5 text-sm text-brand-gray-1 placeholder:text-brand-gray-3 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div className="form-item">
              <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-brand-gray-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="........"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-navy-600 bg-[var(--color-terminal-bg)] px-4 py-3.5 pr-12 text-sm text-brand-gray-1 focus:border-teal-500 focus:outline-none"
                />
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray-3 transition-colors hover:text-teal-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-item flex items-center justify-between">
              <label className="group flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer appearance-none rounded border border-navy-600 checked:border-transparent checked:bg-teal-500 transition-colors group-hover:border-teal-500/60"
                />
                <span className="ml-2.5 text-sm text-brand-gray-2">Remember me</span>
              </label>
              <a href="#" className="text-sm text-teal-500 hover:underline">
                Forgot password?
              </a>
            </div>

            <div className="form-item">
              <button
                disabled={isLoading}
                type="submit"
                className="flex w-full items-center justify-center rounded-xl bg-teal-500 py-4 text-sm font-semibold text-white transition-colors hover:bg-teal-400 disabled:opacity-60"
              >
                {authAction === "credentials" && <Loader2 className="mr-2 animate-spin" size={16} />}
                {authAction === "credentials"
                  ? emailMode === "signin"
                    ? "Authenticating..."
                    : "Creating account..."
                  : emailMode === "signin"
                    ? "Sign In"
                    : "Create Account"}
              </button>
            </div>

            <div className="form-item text-center">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setEmailMode(emailMode === "signin" ? "signup" : "signin")}
                className="text-sm text-teal-500 hover:underline disabled:opacity-60"
              >
                {emailMode === "signin" ? "Need an account? Create one" : "Already have an account? Sign in"}
              </button>
            </div>

            <div className="form-item my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-navy-600" />
              <span className="text-xs font-mono text-brand-gray-3">or</span>
              <div className="h-px flex-1 bg-navy-600" />
            </div>

            <div className="form-item grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleGithubSignIn}
                className="flex items-center justify-center gap-2 rounded-xl border border-navy-600 bg-navy-700 py-3 text-sm text-brand-gray-1 transition hover:border-teal-500"
              >
                {authAction === "github" ? <Loader2 className="animate-spin" size={16} /> : <Github size={16} />}
                {authAction === "github" ? "Connecting..." : "GitHub"}
              </button>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 rounded-xl border border-navy-600 bg-navy-700 py-3 text-sm text-brand-gray-1 transition hover:border-teal-500"
              >
                {authAction === "google" ? <Loader2 className="animate-spin" size={16} /> : <Chrome size={16} />}
                {authAction === "google" ? "Connecting..." : "Google"}
              </button>
            </div>

            <div className="form-item mt-8 text-center">
              <span className="text-sm text-brand-gray-2">Don&apos;t have an account? </span>
              <Link href="/" className="text-sm text-teal-500 hover:underline">
                Get Early Access
              </Link>
            </div>

            <div className="form-item mt-8 flex items-center justify-center gap-2 rounded-xl bg-[var(--color-terminal-bg)] px-4 py-3">
              <div className="h-1.5 w-1.5 animate-[pulse-dot_2s_infinite] rounded-full bg-teal-500" />
              <span className="font-mono text-[11px] text-brand-gray-3">SYSTEM ONLINE . 4 threats monitored</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
