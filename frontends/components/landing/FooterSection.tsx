"use client";

import React from "react";
import Link from "next/link";

export default function FooterSection() {
  return (
    <>
      <section className="border-y border-navy-600 bg-navy-900 px-6 py-24 lg:px-24">
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-teal-500">Live Analysis</div>
            <h3 className="text-3xl font-bold tracking-tight text-brand-gray-1">See ChainGuard in action.</h3>
            <p className="mt-4 text-lg text-brand-gray-2">Run a real maritime risk analysis against our live backend.</p>
          </div>
          <div className="rounded-2xl border border-navy-600 bg-navy-800 p-6">
            <div className="font-semibold text-brand-gray-1">MUMBAI - ROTTERDAM</div>
            <div className="mt-4 flex items-center gap-3">
              <div className="rounded-full border border-amber-600 bg-amber-600 px-3 py-1 font-mono text-xs text-amber-500">
                31.94
              </div>
              <div className="rounded-full border border-amber-600 bg-amber-600 px-3 py-1 font-mono text-[10px] text-amber-500">
                MEDIUM
              </div>
              <div className="rounded-full bg-navy-700 px-3 py-1 font-mono text-xs text-brand-gray-2">10.6 days</div>
            </div>
            <div className="mt-5 font-mono text-xs text-brand-gray-3">4 verified threats . 3 routes computed</div>
            <Link href="/analyzer" className="mt-5 block text-sm font-medium text-teal-500 hover:underline">
              Sign up to run your own analysis -
            </Link>
          </div>
        </div>
      </section>

      <footer id="footer" className="border-t border-navy-600 bg-[var(--color-terminal-bg)] px-6 pb-12 pt-20 lg:px-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="footer-item">
            <div className="nav-logo flex items-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 1 L18 5.5 L18 14.5 L10 19 L2 14.5 L2 5.5 Z" stroke="#1D9E75" strokeWidth="1.5" />
              </svg>
              <span className="ml-2 text-[15px] font-semibold tracking-tight text-brand-gray-1">ChainGuard</span>
            </div>
            <p className="mt-6 max-w-[240px] text-sm leading-[1.8] text-brand-gray-2">
              AI-powered maritime resilience for operators that need clearer risk signals and faster route
              decisions.
            </p>
            <div className="mt-8 inline-block rounded border border-navy-600 px-3 py-1.5 font-mono text-[11px] text-brand-gray-3">
              Built for Hackathon 2026
            </div>
          </div>

          <div className="footer-item">
            <h4 className="mb-6 text-sm font-semibold text-brand-gray-1">Product</h4>
            {["Features", "Integrations", "Pricing", "Changelog"].map((link) => (
              <a key={link} href="#" className="mb-4 block text-sm text-brand-gray-2 transition-colors hover:text-teal-500">
                {link}
              </a>
            ))}
          </div>

          <div className="footer-item">
            <h4 className="mb-6 text-sm font-semibold text-brand-gray-1">Company</h4>
            {["About", "Blog", "Careers", "Contact"].map((link) => (
              <a key={link} href="#" className="mb-4 block text-sm text-brand-gray-2 transition-colors hover:text-teal-500">
                {link}
              </a>
            ))}
          </div>

          <div className="footer-item">
            <h4 className="mb-6 text-sm font-semibold text-brand-gray-1">Legal</h4>
            {["Privacy", "Terms", "Security"].map((link) => (
              <a key={link} href="#" className="mb-4 block text-sm text-brand-gray-2 transition-colors hover:text-teal-500">
                {link}
              </a>
            ))}

            <div className="mt-8">
              <h4 className="mb-3 text-sm font-semibold text-brand-gray-1">Subscribe to updates</h4>
              <input
                type="email"
                placeholder="Email address"
                className="mb-3 w-full rounded-xl border border-navy-600 bg-navy-800 px-4 py-2.5 text-sm text-brand-gray-1 transition-colors focus:border-teal-500 focus:outline-none"
              />
              <button className="w-full rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-400">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="footer-item mt-16 flex flex-col items-center justify-between gap-4 border-t border-navy-600 pt-8 md:flex-row">
          <div className="font-mono text-[11px] text-brand-gray-3">Copyright 2026 ChainGuard.</div>
          <div className="font-mono text-[11px] text-brand-gray-3">Built for Hackathon 2026</div>
        </div>
      </footer>
    </>
  );
}
