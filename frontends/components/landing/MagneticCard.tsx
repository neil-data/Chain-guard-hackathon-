"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function MagneticCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const xMove = (e.clientX - rect.left - rect.width / 2) * 0.06;
      const yMove = (e.clientY - rect.top - rect.height / 2) * 0.06;
      gsap.to(card, { x: xMove, y: yMove, duration: 0.4, ease: "power2.out" });
    };

    const onMouseLeave = () => {
      gsap.to(card, { x: 0, y: 0, duration: 0.6 });
    };

    card.addEventListener("mousemove", onMouseMove);
    card.addEventListener("mouseleave", onMouseLeave);

    return () => {
      card.removeEventListener("mousemove", onMouseMove);
      card.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return (
    <div ref={cardRef} className={className}>
      {children}
    </div>
  );
}

export function MagneticButton({ children, onClick, className }: { children: React.ReactNode, onClick?: () => void, className?: string }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const onMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const xMove = (e.clientX - rect.left - rect.width / 2) * 0.1;
      const yMove = (e.clientY - rect.top - rect.height / 2) * 0.1;
      gsap.to(btn, { x: xMove, y: yMove, duration: 0.4, ease: "power2.out" });
    };
    const onMouseLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.6 });
    btn.addEventListener("mousemove", onMouseMove);
    btn.addEventListener("mouseleave", onMouseLeave);
    return () => {
      btn.removeEventListener("mousemove", onMouseMove);
      btn.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);
  return <button ref={btnRef} onClick={onClick} className={className}>{children}</button>;
}
