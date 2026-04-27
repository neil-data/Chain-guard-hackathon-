"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Brain, ChevronDown, Map as MapIcon, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/landing/HeroSection";
import FooterSection from "@/components/landing/FooterSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import { MagneticButton, MagneticCard } from "@/components/landing/MagneticCard";
import { gsap } from "@/lib/gsap";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const scrollTargets = document.querySelectorAll("[data-scroll-to]");
    const listeners = new Map<Element, EventListener>();

    scrollTargets.forEach((element) => {
      const listener: EventListener = (event) => {
        event.preventDefault();
        const target = element.getAttribute("data-scroll-to");
        if (!target) return;

        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: target, offsetY: 64 },
          ease: "power3.inOut",
        });
      };

      listeners.set(element, listener);
      element.addEventListener("click", listener);
    });

    const ctx = gsap.context(() => {
      gsap.from(".nav-logo", { x: -20, opacity: 0, duration: 0.6 });
      gsap.from(".nav-link", {
        y: -12,
        opacity: 0,
        duration: 0.5,
        stagger: 0.07,
        ease: "power2.out",
        delay: 0.2,
      });
      gsap.from(".nav-cta", {
        scale: 0.94,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
        delay: 0.5,
      });

      gsap.from(".hero-word", {
        y: 80,
        opacity: 0,
        rotateX: -20,
        duration: 1,
        stagger: 0.05,
        ease: "power4.out",
        delay: 0.35,
        transformOrigin: "bottom center",
      });

      gsap.from(".hero-sub", { y: 20, opacity: 0, duration: 0.8, delay: 1.05, ease: "power2.out" });
      gsap.from(".hero-cta", { y: 20, opacity: 0, duration: 0.8, delay: 1.15, ease: "power2.out" });
      gsap.from(".hero-proof", { y: 20, opacity: 0, duration: 0.8, delay: 1.25, ease: "power2.out" });
      gsap.from(".hero-card", { x: 40, opacity: 0, duration: 1, delay: 0.75, ease: "power3.out" });

      document.querySelectorAll(".stat-num").forEach((element) => {
        const finalValue = element.getAttribute("data-val") || "0";
        gsap.to(element, {
          innerHTML: finalValue,
          duration: 2.5,
          ease: "power2.out",
          snap: { innerHTML: 1 },
          scrollTrigger: { trigger: element, start: "top 85%" },
        });
      });

      gsap.from(".feature-card", {
        y: 48,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: "#features", start: "top 75%" },
      });

      gsap.to(".marquee-row-1", { xPercent: -50, duration: 30, ease: "none", repeat: -1 });
      gsap.to(".marquee-row-2", { xPercent: 50, duration: 35, ease: "none", repeat: -1 });

      document.querySelectorAll(".hiw-step").forEach((step, index) => {
        const textSide = step.querySelector(".hiw-text");
        const terminalSide = step.querySelector(".hiw-term");
        const direction = index % 2 === 0 ? -40 : 40;

        gsap.from(textSide, {
          x: direction,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: { trigger: step, start: "top 75%" },
        });

        gsap.from(terminalSide, {
          x: -direction,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: { trigger: step, start: "top 75%" },
        });
      });

      gsap.from(".footer-item", {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: "#footer", start: "top 90%" },
      });
    });

    const onScroll = () => {
      const nav = document.getElementById("navbar");
      if (!nav) return;

      if (window.scrollY > 40) {
        nav.classList.add("bg-navy-900/90", "backdrop-blur-xl", "border-b", "border-navy-600");
      } else {
        nav.classList.remove("bg-navy-900/90", "backdrop-blur-xl", "border-b", "border-navy-600");
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      ctx.revert();
      listeners.forEach((listener, element) => element.removeEventListener("click", listener));
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-navy-900 text-brand-gray-1">
      <nav
        id="navbar"
        className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-transparent px-6 transition-all duration-300 lg:px-12"
      >
        <div className="nav-logo flex shrink-0 items-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1 L18 5.5 L18 14.5 L10 19 L2 14.5 L2 5.5 Z" stroke="#1D9E75" strokeWidth="1.5" />
          </svg>
          <span className="ml-2 text-[15px] font-semibold tracking-tight text-brand-gray-1">ChainGuard</span>
        </div>

        <div className="hidden items-center gap-8 lg:flex">
          <button className="nav-link flex items-center text-sm text-brand-gray-2 transition-colors hover:text-brand-gray-1">
            Product <ChevronDown size={14} className="ml-1" />
          </button>
          <button data-scroll-to="#features" className="nav-link text-sm text-brand-gray-2 transition-colors hover:text-brand-gray-1">
            Features
          </button>
          <button
            data-scroll-to="#how-it-works"
            className="nav-link text-sm text-brand-gray-2 transition-colors hover:text-brand-gray-1"
          >
            How It Works
          </button>
          <Link href="/analyzer" className="nav-link text-sm text-brand-gray-2 transition-colors hover:text-brand-gray-1">
            Track
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login" className="nav-cta px-4 py-2 text-sm text-brand-gray-2 transition-colors hover:text-brand-gray-1">
            Sign In
          </Link>
          <MagneticButton
            onClick={() => router.push("/login")}
            className="nav-cta rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-400"
          >
            Get Early Access
          </MagneticButton>
        </div>
      </nav>

      <HeroSection onNavigate={(path) => router.push(path)} />

      <section id="stats" className="border-y border-navy-600 bg-navy-800 py-28">
        <div className="flex flex-col justify-center md:flex-row">
          {[
            { val: 50, suffix: "+", label: "ACTIVE ROUTES" },
            { val: 2, prefix: "<", suffix: "s", label: "AI RESPONSE TIME" },
            { val: 94, suffix: ".3%", label: "PREDICTION ACCURACY" },
            { val: 3, suffix: "x", label: "FASTER REROUTING" },
          ].map((stat, index) => (
            <div
              key={index}
              className="group flex-1 border-r border-navy-600 py-6 text-center last:border-0 md:py-0"
            >
              <div className="text-[clamp(44px,6vw,72px)] font-black tracking-[-0.04em] text-brand-gray-1 transition-colors duration-300 group-hover:text-teal-500">
                {stat.prefix}
                <span className="stat-num" data-val={stat.val}>
                  0
                </span>
                {stat.suffix}
              </div>
              <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gray-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="bg-navy-900 px-6 py-32 lg:px-24">
        <div>
          <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.25em] text-teal-500">Platform Capabilities</div>
          <h2 className="text-[clamp(32px,5vw,52px)] font-bold tracking-tight text-brand-gray-1">
            Intelligence at every node.
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-brand-gray-2">
            ChainGuard transforms reactive supply chain management into a proactive, data-driven operation.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <MagneticCard className="feature-card rounded-2xl border border-navy-600 bg-navy-800 p-8 transition-colors duration-300 hover:border-teal-500">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-700">
                <Brain size={20} className="text-teal-500" />
              </div>
              <div className="rounded-full bg-teal-600 px-3 py-1 font-mono text-[11px] text-teal-200">AI-POWERED</div>
            </div>
            <h3 className="mt-10 text-xl font-semibold tracking-tight text-brand-gray-1">Predictive Risk Scoring</h3>
            <p className="mt-4 text-sm leading-[1.7] text-brand-gray-2">
              Our XGBoost model trains on 3,000 synthetic routes with 16 features across weather, verified
              intelligence, geopolitical signals, and chokepoint exposure.
            </p>
          </MagneticCard>

          <MagneticCard className="feature-card rounded-2xl border border-navy-600 bg-navy-800 p-8 transition-colors duration-300 hover:border-teal-500">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-700">
                <MapIcon size={20} className="text-teal-500" />
              </div>
              <div className="rounded-full bg-teal-600 px-3 py-1 font-mono text-[11px] text-teal-200">REAL-TIME</div>
            </div>
            <h3 className="mt-10 text-xl font-semibold tracking-tight text-brand-gray-1">Dynamic Rerouting</h3>
            <p className="mt-4 text-sm leading-[1.7] text-brand-gray-2">
              Yen&apos;s K-shortest paths computes alternatives in milliseconds, then scores them against threat
              zones, weather exposure, and congestion risk.
            </p>
          </MagneticCard>

          <MagneticCard className="feature-card rounded-2xl border border-navy-600 bg-navy-800 p-8 transition-colors duration-300 hover:border-teal-500">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-700">
                <Zap size={20} className="text-teal-500" />
              </div>
              <div className="rounded-full bg-navy-700 px-3 py-1 font-mono text-[11px] text-brand-gray-2">EXPLAINABLE</div>
            </div>
            <h3 className="mt-10 text-xl font-semibold tracking-tight text-brand-gray-1">SHAP Value Insights</h3>
            <p className="mt-4 text-sm leading-[1.7] text-brand-gray-2">
              Feature-level attribution shows exactly which risk signals pushed a route higher, from weather
              severity to threat density and chokepoint load.
            </p>
          </MagneticCard>
        </div>
      </section>

      <section className="overflow-hidden border-y border-navy-600 bg-[var(--color-terminal-bg)] py-6">
        <div className="marquee-row-1 mb-2 flex" style={{ width: "200%" }}>
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex whitespace-nowrap font-mono text-xs text-brand-gray-2">
              <span className="px-4 text-red-500">WAR</span>
              <span className="px-4">Strait of Hormuz</span>
              <span className="px-4 text-brand-gray-3">.</span>
              <span className="px-4 text-amber-500">SANCTIONS</span>
              <span className="px-4">Persian Gulf</span>
              <span className="px-4 text-brand-gray-3">.</span>
              <span className="px-4 text-teal-500">VERIFIED</span>
              <span className="px-4">Threat cluster confirmed</span>
              <span className="px-4 text-brand-gray-3">.</span>
            </div>
          ))}
        </div>

        <div className="marquee-row-2 flex" style={{ width: "200%", transform: "translateX(-50%)" }}>
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex whitespace-nowrap font-mono text-xs text-brand-gray-2">
              <span className="px-4">Route MUMBAI - ROTTERDAM</span>
              <span className="px-4 text-brand-gray-3">.</span>
              <span className="px-4 text-amber-500">Weather risk 43.3%</span>
              <span className="px-4 text-brand-gray-3">.</span>
              <span className="px-4 text-teal-500">4 sources corroborated</span>
              <span className="px-4 text-brand-gray-3">.</span>
            </div>
          ))}
        </div>
      </section>

      <HowItWorksSection />
      <FooterSection />
    </div>
  );
}
