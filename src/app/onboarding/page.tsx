"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2, Store, BarChart3, Globe, CheckCircle2, Check,
  ArrowRight, ArrowLeft, Target, Zap, Sparkles, TrendingUp, LifeBuoy,
} from "lucide-react";

const steps = [
  { icon: Building2, title: "Company Info", desc: "Basic brand and business details" },
  { icon: Store, title: "Sales Channels", desc: "Where you sell your products" },
  { icon: BarChart3, title: "Order Volume", desc: "Estimate your monthly orders" },
  { icon: Globe, title: "Markets", desc: "Where you ship to" },
  { icon: CheckCircle2, title: "Review", desc: "Confirm your details and finish" },
];

const benefits = [
  { icon: Target, title: "Optimize your matches", desc: "We pair you with the best-fit suppliers and shipping routes." },
  { icon: Zap, title: "Faster onboarding", desc: "Skip repetitive steps and get live sooner." },
  { icon: Sparkles, title: "Personalized recommendations", desc: "Plans and pricing tuned to your volume and goals." },
  { icon: TrendingUp, title: "Stronger results", desc: "Brands with complete profiles see better outcomes." },
];

const channels = ["Shopify", "WooCommerce", "Amazon", "eBay", "TikTok Shop", "Etsy"];

function BrandLogo({ name, className }: { name: string; className?: string }) {
  switch (name) {
    case "Shopify":
      return (
        <svg viewBox="0 0 256 292" className={className} aria-hidden>
          <path fill="#95BF47" d="M223.8 57.3c-.2-1.5-1.5-2.3-2.6-2.4-1.1-.1-22.7-1.7-22.7-1.7s-15-14.9-16.7-16.5c-1.7-1.7-4.9-1.2-6.2-.8-.2.1-3.4 1-8.6 2.6-5.2-14.9-14.3-28.6-30.4-28.6h-1.4C130.4 3.6 124.7.9 119.7.9c-38.3.1-56.7 48-62.4 72.3-14.9 4.6-25.5 7.9-26.9 8.3-8.3 2.6-8.5 2.9-9.6 10.7C20 98.1.1 252.4.1 252.4l155.4 29.1 84.2-18.2S224 58.8 223.8 57.3zM150.6 39.3l-13.8 4.3c0-1 .1-1.9.1-3 0-9.6-1.3-17.4-3.5-23.5 8.6 1.1 14.4 11 17.2 22.2zM123 18.8c2.4 6 4 14.7 4 26.4v1.9l-28.5 8.8C104 35.2 115 25.4 123 18.8zM111.8 8.1c1.4 0 2.9.5 4.2 1.4-10.6 5-22 17.5-26.8 42.6l-22.6 7C72.2 36.5 87.7 8.1 111.8 8.1z"/>
          <path fill="#5E8E3E" d="M221.2 54.9c-1.1-.1-22.7-1.7-22.7-1.7s-15-14.9-16.7-16.5c-.6-.6-1.5-.9-2.3-1l-11.7 240 84.2-18.2S224 58.8 223.8 57.3c-.2-1.5-1.5-2.3-2.6-2.4z"/>
          <path fill="#FFF" d="M135.3 104.7l-10.4 30.9s-9.1-4.9-20.3-4.9c-16.4 0-17.2 10.3-17.2 12.9 0 14.1 36.8 19.5 36.8 52.6 0 26-16.5 42.8-38.8 42.8-26.7 0-40.4-16.6-40.4-16.6l7.1-23.6s14 12 25.9 12c7.8 0 11-6.1 11-10.6 0-18.4-30.2-19.2-30.2-49.5 0-25.5 18.3-50.1 55.2-50.1 14.2 0 21.3 4.1 21.3 4.1z"/>
        </svg>
      );
    case "WooCommerce":
      return (
        <svg viewBox="0 0 256 153" className={className} aria-hidden>
          <path fill="#7F54B3" d="M23.8 0h208.2c13.2 0 23.9 10.7 23.9 23.9v79.6c0 13.2-10.7 23.9-23.9 23.9H157.3l10.2 25.1-45.1-25.1H23.9C10.7 127.4 0 116.7 0 103.5V23.9C-.1 10.7 10.6 0 23.8 0z"/>
          <path fill="#FFF" d="M14.6 21.8c1.5-2 3.6-3 6.5-3.2 5.3-.4 8.3 2.1 9 7.5 3.1 20.9 6.5 38.6 10.1 53.1l21.9-41.7c2-3.8 4.5-5.8 7.5-6 4.4-.3 7.1 2.5 8.2 8.4 2.5 13.3 5.7 24.6 9.5 34.2 2.6-25.4 7-43.7 13.2-55 1.6-3 3.9-4.5 7-4.7 2.4-.2 4.6.5 6.6 2.1 2 1.6 3 3.6 3.2 6 .1 1.9-.2 3.5-1.1 5.1-3.9 7.2-7.1 19.2-9.7 35.9-2.5 16.2-3.4 28.8-2.8 37.8.2 2.5-.2 4.7-1.2 6.6-1.2 2.2-3 3.4-5.3 3.6-2.6.2-5.3-1-7.9-3.7-9.3-9.5-16.7-23.7-22.1-42.6-6.5 12.8-11.3 22.4-14.4 28.8-5.9 11.3-10.9 17.1-15.1 17.4-2.7.2-5-2.1-7-6.9-5.1-13.1-10.6-38.4-16.5-75.9-.4-2.6.2-4.9 1.7-6.9z"/>
        </svg>
      );
    case "Amazon":
      return (
        <svg viewBox="0 0 256 256" className={className} aria-hidden>
          <path fill="#FF9900" d="M158.6 195.2c-14.9 11-36.5 16.8-55.1 16.8-26.1 0-49.6-9.6-67.4-25.7-1.4-1.3-.1-3 1.6-2 19.2 11.1 42.9 17.9 67.4 17.9 16.5 0 34.7-3.4 51.4-10.5 2.5-1.1 4.6 1.7 2.1 3.5z"/>
          <path fill="#FF9900" d="M164.8 188.1c-1.9-2.4-12.6-1.2-17.4-.6-1.4.2-1.7-1.1-.4-2 8.5-6 22.5-4.3 24.1-2.3 1.6 2.1-.4 16.1-8.4 22.8-1.2 1-2.4.5-1.8-.9 1.8-4.6 5.9-15 3.9-17z"/>
          <path fill="#221F1F" d="M147.8 24.9V14.2c0-1.6 1.2-2.7 2.7-2.7h47.9c1.5 0 2.8 1.1 2.8 2.7v9.2c0 1.5-1.3 3.6-3.6 6.8l-24.8 35.4c9.2-.2 19 1.2 27.4 5.9 1.9 1.1 2.4 2.6 2.5 4.2v11.4c0 1.6-1.7 3.4-3.5 2.5-14.8-7.8-34.5-8.6-50.9.1-1.7.9-3.4-.9-3.4-2.5V76.1c0-1.7 0-4.7 1.8-7.4l28.7-41.2h-25c-1.5 0-2.8-1.1-2.8-2.6z"/>
          <path fill="#221F1F" d="M51.3 96.3H36.7c-1.4-.1-2.5-1.1-2.6-2.5V14.4c0-1.5 1.3-2.7 2.8-2.7h13.6c1.4.1 2.5 1.2 2.6 2.5v10.4h.3c3.5-9.5 10.2-13.9 19.2-13.9 9.1 0 14.9 4.4 19 13.9 3.5-9.5 11.6-13.9 20.2-13.9 6.1 0 12.8 2.5 16.8 8.2 4.6 6.3 3.7 15.4 3.7 23.4v47.1c0 1.5-1.3 2.7-2.8 2.7h-14.5c-1.5-.1-2.6-1.3-2.6-2.7V53.2c0-3.2.3-11.1-.4-14.1-1.1-5-4.4-6.4-8.6-6.4-3.5 0-7.2 2.4-8.7 6.1-1.5 3.8-1.4 10.1-1.4 14.4v39.6c0 1.5-1.3 2.7-2.8 2.7H76.5c-1.5-.1-2.6-1.3-2.6-2.7l-.1-39.6c0-8.3 1.4-20.6-9-20.6-10.5 0-10.1 11.9-10.1 20.6v39.6c.1 1.5-1.2 2.7-2.7 2.7z"/>
        </svg>
      );
    case "eBay":
      return (
        <svg viewBox="0 0 256 103" className={className} aria-hidden>
          <path fill="#E53238" d="M33.4 28.3C15.1 28.3 0 36 0 59.4c0 18.6 10.3 30.3 33.9 30.3 27.8 0 29.6-18.3 29.6-18.3H49.1s-2.9 9.9-15.9 9.9c-10.6 0-18.2-7.2-18.2-17.2h49.7v-6.8c0-10.8-6.9-29-31.3-29zm-.5 8.6c10.1 0 17 6.2 17 15.5H15c0-9.9 9-15.5 17.9-15.5z"/>
          <path fill="#0064D2" d="M64.7 0v77.5c0 4.4-.3 10.6-.3 10.6h13.7s.5-4.4.5-8.5c0 0 6.8 10.6 25.2 10.6 19.4 0 32.6-13.5 32.6-32.8 0-17.9-12.1-32.4-32.5-32.4-19.1 0-25.1 10.3-25.1 10.3V0H64.7zm33.9 37c13.1 0 21.5 9.8 21.5 22.4 0 13.6-9.6 22.8-21.4 22.8-14.1 0-21.6-11-21.6-22.7 0-10.9 6.7-22.5 21.5-22.5z"/>
          <path fill="#F5AF02" d="M171.5 28.3c-27.4 0-29.1 15-29.1 17.4h14.5s.8-9 13.6-9c8.3 0 14.8 3.8 14.8 11.2v3h-14.8c-19.6 0-30 5.7-30 17.4 0 11.5 9.6 17.7 22.5 17.7 17.6 0 23.3-9.7 23.3-9.7 0 4.6.4 9.1.4 9.1h12.9s-.5-5.6-.5-9.2V49.8c0-15.5-12.5-21.5-27.6-21.5zm13.8 31.5v4c0 5.3-3.3 18.4-22.5 18.4-10.5 0-15-5.2-15-11.3 0-11 15.1-11.1 37.5-11.1z"/>
          <path fill="#86B817" d="M192.1 30.8h16.3l23.4 46.9 23.3-46.9H255l-42.5 83.4h-15.5l12.3-23.3z"/>
        </svg>
      );
    case "TikTok Shop":
      return (
        <svg viewBox="0 0 256 290" className={className} aria-hidden>
          <path fill="#FF004F" d="M189.7 104.4c18.7 13.4 41.6 21.3 66.3 21.3v-47.5c-4.7 0-9.3-.5-13.9-1.4v37.4c-24.7 0-47.6-7.9-66.3-21.3v96.9c0 48.5-39.3 87.8-87.8 87.8-18.1 0-34.9-5.5-48.9-14.8 16 16.3 38.2 26.4 62.8 26.4 48.5 0 87.9-39.3 87.9-87.8v-96.9zm17.2-47.9c-9.6-10.4-15.8-23.9-17.2-38.8v-6.1h-13.2c3.3 19 14.6 35.2 30.4 44.9zM69.9 222.5c-5.3-7-8.2-15.6-8.2-24.4 0-22.3 18.1-40.4 40.4-40.4 4.2 0 8.3.6 12.2 1.9v-48.6c-4.6-.6-9.2-.9-13.9-.8v37.8c-3.9-1.2-8-1.9-12.2-1.9-22.3 0-40.4 18.1-40.4 40.4 0 15.8 9 29.4 22.1 36z"/>
          <path fill="#000" d="M175.8 93.9c18.7 13.4 41.6 21.3 66.3 21.3V77.8c-13.8-2.9-26-10.1-35.2-20.1-15.8-9.7-27.1-25.9-30.4-44.9h-34.6v189.9c-.1 22.2-18.1 40.2-40.4 40.2-13.1 0-24.8-6.2-32.2-15.9-13.1-6.6-22.1-20.2-22.1-36 0-22.3 18.1-40.4 40.4-40.4 4.3 0 8.4.7 12.2 1.9v-37.8c-47.7 1-86 39.9-86 87.8 0 23.9 9.6 45.6 25.1 61.4 14 9.3 30.8 14.8 48.9 14.8 48.5 0 87.8-39.3 87.8-87.8V93.9z"/>
          <path fill="#00F2EA" d="M242.1 77.8v-10.1c-12.4 0-24.6-3.5-35.2-10 9.4 10.2 21.7 17.3 35.2 20.1zM176.5 12.8c-.3-1.8-.6-3.6-.7-5.4V1.3h-47.8v189.9c-.1 22.2-18.1 40.2-40.4 40.2-6.6 0-12.8-1.6-18.3-4.3 7.4 9.7 19.1 15.9 32.2 15.9 22.3 0 40.3-18 40.4-40.2V12.8h34.6zM101.9 113.9v-10.8c-4-.5-8-.8-12.1-.8C41.3 102.3 1.9 141.6 1.9 190.1c0 30.4 15.5 57.2 39 73 -15.5-15.8-25.1-37.5-25.1-61.4 0-47.9 38.3-86.8 86.1-87.8z"/>
        </svg>
      );
    case "Etsy":
      return (
        <svg viewBox="0 0 256 256" className={className} aria-hidden>
          <rect width="256" height="256" rx="40" fill="#F1641E"/>
          <path fill="#FFF" d="M101.7 79.6c0-2.3.2-3.6 4.2-3.6h54.6c9.6 0 14.8 8.1 18.6 23.3l3 12.1h9.2c1.6-37.4 3.3-53.8 3.3-53.8s-25.7 2.9-40.9 2.9H93.4l-27.8-.9v9.8l9.4 1.8c6.6 1.3 8.2 2.7 8.7 8.8 0 0 .6 17.9.6 47.4s-.6 47.2-.6 47.2c0 5.4-2.1 7.4-8.7 8.7l-9.4 1.8v9.8l27.8-.9h46.6c15.4 0 51.1 1.8 51.1 1.8 .8-9.4 6-41.3 6.7-44.8h-8.7l-9.6 21.6c-7.6 17.1-18.6 18.2-30.8 18.2h-18.4c-12.2 0-18.6-4.8-18.6-15.3 0 0-.5-23.4-.5-37.9 0 0 19.6 0 26 .5 4.9.4 7.9 1.7 9.4 8.4l2.7 11.6h9.8l-.6-31.2.9-31.4h-9.8l-3 13c-1.5 6.5-2.5 8-9.4 8.5-9 .6-25.4.5-25.4.5z"/>
        </svg>
      );
    default:
      return null;
  }
}

function TrustLogo({ name }: { name: string }) {
  const cls = "h-6 w-auto";
  switch (name) {
    case "Visa":
      return (
        <svg viewBox="0 0 48 16" className={cls} aria-label="Visa">
          <path fill="#1A1F71" d="M20.4 15.3h-3.3L19.2.8h3.3l-2.1 14.5zM14.4.8l-3.1 9.9-.4-1.9L9.8 2.3S9.6.8 7.7.8H2.5L2.4 1s2 .4 4.3 1.8l3.6 12.5h3.5L19.3.8h-4.9zM45.5 15.3H48L45.8.8h-2.2c-1 0-1.3.8-1.3.8l-4.2 13.7h3.5l.7-1.9h4.3l.4 1.9zm-3.7-4.5l1.8-4.9.1 4.9h-1.9zM38.6 3.9l.5-2.8S37.6.8 36 .8c-1.7 0-5.8.7-5.8 4.4 0 3.4 4.8 3.5 4.8 5.3 0 1.8-4.3 1.5-5.7.4l-.5 2.9s1.5.7 3.8.7c2.3 0 5.8-1.2 5.8-4.6 0-3.5-4.8-3.8-4.8-5.4 0-1.5 3.4-1.3 4.6-.6z"/>
        </svg>
      );
    case "Mastercard":
      return (
        <svg viewBox="0 0 36 24" className={cls} aria-label="Mastercard">
          <circle cx="13" cy="12" r="10" fill="#EB001B" />
          <circle cx="23" cy="12" r="10" fill="#F79E1B" />
          <path fill="#FF5F00" d="M18 4.3a10 10 0 0 0 0 15.4 10 10 0 0 0 0-15.4z" />
        </svg>
      );
    case "PayPal":
      return (
        <svg viewBox="0 0 50 16" className={cls} aria-label="PayPal">
          <path fill="#003087" d="M6.9 1.2H2.4c-.3 0-.6.2-.6.5L0 14.3c0 .2.1.4.3.4h2.2c.3 0 .6-.2.6-.5l.5-3.2c0-.3.3-.5.6-.5h1.4c3 0 4.7-1.4 5.1-4.3.2-1.3 0-2.3-.6-3-.7-.8-1.9-1.2-3.7-1.2zm.5 4.3c-.3 1.6-1.5 1.6-2.6 1.6h-.7l.5-3c0-.2.2-.3.4-.3h.3c.8 0 1.5 0 1.9.4.2.3.3.7.2 1.3z"/>
          <path fill="#0070E0" d="M22.6 5.5h-2.2c-.2 0-.4.1-.4.3l-.1.6-.2-.2c-.5-.7-1.5-.9-2.5-.9-2.4 0-4.4 1.8-4.8 4.3-.2 1.3.1 2.5.8 3.3.6.8 1.6 1.1 2.7 1.1 1.9 0 3-1.2 3-1.2l-.1.6c0 .2.1.4.3.4h2c.3 0 .6-.2.6-.5l1.2-7.5c0-.2-.1-.3-.3-.3zm-3.1 4.2c-.2 1.2-1.2 2.1-2.4 2.1-.6 0-1.1-.2-1.4-.6-.3-.4-.4-.9-.3-1.5.2-1.2 1.2-2.1 2.4-2.1.6 0 1.1.2 1.4.6.3.4.4.9.3 1.5z"/>
          <path fill="#003087" d="M34.4 5.5h-2.2c-.2 0-.4.1-.5.3l-3 4.5-1.3-4.3c-.1-.3-.3-.4-.6-.4h-2.1c-.2 0-.4.2-.3.5l2.4 7.1-2.3 3.2c-.2.2 0 .5.2.5h2.2c.2 0 .4-.1.5-.3l7.3-10.6c.2-.3 0-.5-.3-.5z"/>
          <path fill="#0070E0" d="M41.7 1.2h-4.5c-.3 0-.6.2-.6.5l-1.8 11.6c0 .2.1.4.3.4h2.3c.2 0 .4-.1.4-.3l.5-3.3c0-.3.3-.5.6-.5h1.4c3 0 4.7-1.4 5.1-4.3.2-1.3 0-2.3-.6-3-.7-.7-1.9-1.1-3.6-1.1zm.5 4.3c-.3 1.6-1.5 1.6-2.6 1.6h-.7l.5-3c0-.2.2-.3.4-.3h.3c.8 0 1.5 0 1.9.4.2.3.3.7.2 1.3z"/>
        </svg>
      );
    case "Stripe":
      return (
        <svg viewBox="0 0 60 25" className={cls} aria-label="Stripe">
          <path fill="#635BFF" d="M60 12.9c0-4.3-2.1-7.6-6-7.6-4 0-6.4 3.4-6.4 7.6 0 5 2.8 7.5 6.9 7.5 2 0 3.5-.5 4.6-1.1v-3.3c-1.1.6-2.4 1-4 1-1.6 0-3-.6-3.2-2.5h8.1v-1.6zm-8.2-1.6c0-1.8 1.1-2.6 2.1-2.6 1 0 2 .8 2 2.6h-4.1zM41.3 5.3c-1.7 0-2.7.8-3.3 1.3l-.2-1h-3.7v19l4.2-.9v-4.6c.6.4 1.5 1 3 1 3 0 5.8-2.4 5.8-7.7 0-4.9-2.8-7.1-5.8-7.1zm-1 11.6c-1 0-1.6-.4-2-.8V9.6c.4-.5 1-.8 2-.8 1.6 0 2.6 1.7 2.6 4 0 2.4-1 4.1-2.6 4.1zM28.3 4.3l4.2-.9V0l-4.2.9v3.4zM28.3 5.6h4.2v14.5h-4.2V5.6zM23.8 6.8l-.3-1.2h-3.6v14.5h4.2v-9.8c1-1.3 2.7-1 3.2-.9V5.6c-.5-.2-2.5-.5-3.5 1.2zM15.4 2l-4.1.9v13.4c0 2.5 1.9 4.3 4.3 4.3 1.4 0 2.4-.3 2.9-.5v-3.4c-.5.2-3.1 1-3.1-1.5V9.2h3.1V5.6h-3.1V2zM4.2 9.8c0-.7.5-.9 1.4-.9 1.2 0 2.8.4 4 1V6c-1.3-.5-2.6-.7-4-.7C2.3 5.3 0 7 0 9.9c0 4.5 6.2 3.8 6.2 5.7 0 .8-.7 1-1.6 1-1.3 0-3-.5-4.3-1.3v4c1.5.6 3 .9 4.3.9 3.4 0 5.7-1.7 5.7-4.6 0-4.9-6.1-4-6.1-5.8z"/>
        </svg>
      );
    default:
      return null;
  }
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-[13px] font-medium text-deep-navy mb-1.5">{children}</label>;
}
const inputCls =
  "w-full px-4 py-2.5 rounded-[10px] border border-border-soft text-sm bg-white focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors";

export default function OnboardingPage() {
  const [active] = useState(0);
  const [biz, setBiz] = useState("Brand owner");
  const [picked, setPicked] = useState<string[]>(["Shopify"]);
  const toggle = (n: string) => setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));

  return (
    <section
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(1200px 600px at 80% -5%, rgba(0,184,148,0.06) 0%, transparent 55%), linear-gradient(180deg, #F0F6FC 0%, #F5F8FB 40%, #F7FAFC 100%)",
      }}
    >
      <div className="max-w-[1240px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-deep-navy">
            Welcome to <span className="text-navy">Fulfill</span><span className="text-teal">Mesh!</span>
          </h1>
          <p className="mt-2 text-[15px] text-text-body">Let&apos;s set up your account in a few simple steps.</p>
        </div>

        {/* Dashboard preview banner */}
        <div className="mb-8 bg-white rounded-2xl border border-border-soft shadow-card overflow-hidden">
          <div className="flex">
            {/* Mini sidebar */}
            <div className="hidden md:flex flex-col gap-0.5 w-[150px] shrink-0 border-r border-border-soft p-3">
              {["Overview", "Orders", "Shipments", "Quality Control", "Inventory", "Warehouses", "Partners", "Reports", "Settings"].map((m, i) => (
                <span key={m} className={`text-[11px] px-2.5 py-1.5 rounded-lg ${i === 0 ? "bg-teal/8 text-teal font-semibold" : "text-text-muted"}`}>{m}</span>
              ))}
            </div>
            {/* Main preview */}
            <div className="flex-1 p-5 min-w-0">
              <p className="text-[14px] font-bold text-deep-navy mb-3">Overview</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {[
                  { label: "Orders", value: "128", delta: "12%" },
                  { label: "Shipments", value: "42", delta: "8%" },
                  { label: "On-Time Delivery", value: "98%", delta: "5%" },
                  { label: "QC Inspections", value: "36", delta: "16%" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border-soft p-3">
                    <p className="text-[11px] text-text-muted">{s.label}</p>
                    <p className="text-[22px] font-bold text-deep-navy leading-tight mt-0.5">{s.value}</p>
                    <span className="inline-flex items-center gap-0.5 mt-1.5 px-1.5 py-0.5 rounded-full bg-teal/12 text-[9px] font-semibold text-teal">
                      <TrendingUp className="w-2.5 h-2.5" /> {s.delta}
                      <span className="text-text-muted font-normal ml-0.5">30d</span>
                    </span>
                  </div>
                ))}
              </div>
              <div className="grid lg:grid-cols-[1fr_220px] gap-4">
                {/* Recent shipments table */}
                <div className="rounded-xl border border-border-soft p-3 min-w-0">
                  <p className="text-[12px] font-semibold text-deep-navy mb-2">Recent Shipments</p>
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-x-3 gap-y-1.5 text-[10px]">
                    <span className="text-text-muted">Shipment ID</span>
                    <span className="text-text-muted">Route</span>
                    <span className="text-text-muted">Status</span>
                    {[
                      { id: "SHP-2024-0981", route: "Shenzhen → Los Angeles", status: "In Transit", tone: "bg-action-blue/10 text-action-blue" },
                      { id: "SHP-2024-0172", route: "Ningbo → New York", status: "In Transit", tone: "bg-action-blue/10 text-action-blue" },
                      { id: "SHP-2024-0965", route: "Shanghai → London", status: "Delivered", tone: "bg-teal/10 text-teal" },
                    ].map((r) => (
                      <div key={r.id} className="contents">
                        <span className="text-deep-navy font-medium truncate">{r.id}</span>
                        <span className="text-text-body truncate">{r.route}</span>
                        <span className={`px-2 py-0.5 rounded-full font-medium justify-self-start ${r.tone}`}>{r.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Donut */}
                <div className="rounded-xl border border-border-soft p-3">
                  <p className="text-[12px] font-semibold text-deep-navy mb-2">Orders by Status</p>
                  <div className="flex items-center gap-3">
                    <div className="relative w-[72px] h-[72px] shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0057D8" strokeWidth="4" strokeDasharray="44 56" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#00B894" strokeWidth="4" strokeDasharray="16 84" strokeDashoffset="-44" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FF9900" strokeWidth="4" strokeDasharray="22 78" strokeDashoffset="-60" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#9AA8B8" strokeWidth="4" strokeDasharray="18 82" strokeDashoffset="-82" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[14px] font-bold text-deep-navy leading-none">128</span>
                        <span className="text-[8px] text-text-muted">Total</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-[9px]">
                      {[
                        { c: "#0057D8", t: "In Production 56 (44%)" },
                        { c: "#00B894", t: "QC 20 (16%)" },
                        { c: "#FF9900", t: "In Transit 28 (22%)" },
                        { c: "#9AA8B8", t: "Delivered 23 (18%)" },
                      ].map((l) => (
                        <div key={l.t} className="flex items-center gap-1.5 text-text-body">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.c }} />{l.t}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-7" style={{ gridTemplateColumns: "minmax(0,240px) minmax(0,1fr) minmax(0,280px)" }}>
          {/* Left stepper */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-border-soft p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted px-2 mb-3">Let&apos;s set up your account</p>
              <ol className="space-y-1">
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  const isActive = i === active;
                  const done = i < active;
                  return (
                    <li key={s.title}>
                      <div className={`flex items-start gap-3 p-2.5 rounded-xl ${isActive ? "bg-teal/8" : ""}`}>
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isActive ? "bg-teal text-white" : done ? "bg-teal/15 text-teal" : "bg-soft-bg text-text-muted"}`}>
                          {done ? <Check className="w-4 h-4" /> : isActive ? <span className="text-[11px] font-bold">{i + 1}</span> : <Icon className="w-4 h-4" />}
                        </span>
                        <div>
                          <p className={`text-[13px] font-semibold ${isActive ? "text-deep-navy" : "text-text-body"}`}>{s.title}</p>
                          <p className="text-[11px] text-text-muted leading-snug">{s.desc}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className="bg-teal/8 rounded-2xl border border-teal/15 p-4">
              <p className="text-[13px] font-semibold text-deep-navy">Almost there!</p>
              <p className="mt-1 text-[12px] text-text-body leading-relaxed">Complete your profile to unlock tailored supplier matches and pricing.</p>
            </div>
            <div className="flex items-center gap-2 px-2 text-[12px] text-text-muted">
              <LifeBuoy className="w-4 h-4" /> Need help? <Link href="/contact" className="text-teal font-medium">Contact Support</Link>
            </div>
          </aside>

          {/* Center form */}
          <div className="space-y-6">
            {/* Company Information */}
            <div className="bg-white rounded-2xl border border-border-soft p-7">
              <h2 className="text-[18px] font-bold text-deep-navy mb-5">Company Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Company Name</Label><input className={inputCls} placeholder="Acme Brands Inc." /></div>
                <div><Label>Website</Label><input className={inputCls} placeholder="https://yourstore.com" /></div>
                <div>
                  <Label>Industry</Label>
                  <select className={inputCls}>
                    {["E-commerce Retail", "Apparel & Fashion", "Electronics", "Beauty & Personal Care", "Home & Kitchen", "Other"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Company Size</Label>
                  <select className={inputCls}>
                    {["1–10 employees", "11–50 employees", "51–200 employees", "200+ employees"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Primary Contact */}
            <div className="bg-white rounded-2xl border border-border-soft p-7">
              <h2 className="text-[18px] font-bold text-deep-navy mb-5">Primary Contact</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>First Name</Label><input className={inputCls} placeholder="Jane" /></div>
                <div><Label>Last Name</Label><input className={inputCls} placeholder="Doe" /></div>
                <div><Label>Email</Label><input type="email" className={inputCls} placeholder="jane@company.com" /></div>
                <div><Label>Phone</Label><input className={inputCls} placeholder="+1 (555) 000-0000" /></div>
                <div className="sm:col-span-2">
                  <Label>Role</Label>
                  <select className={inputCls}>
                    {["Operations Manager", "Founder / CEO", "Logistics Lead", "E-commerce Manager", "Other"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Tell us about your business */}
            <div className="bg-white rounded-2xl border border-border-soft p-7">
              <h2 className="text-[18px] font-bold text-deep-navy mb-2">Tell us about your business</h2>
              <p className="text-[13px] text-text-muted mb-4">What type of business are you?</p>
              <div className="flex flex-wrap gap-2.5 mb-6">
                {["Brand owner", "Retailer", "Wholesaler", "Dropshipper"].map((b) => (
                  <button key={b} onClick={() => setBiz(b)}
                    className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-colors ${biz === b ? "bg-teal/10 border-teal text-teal" : "border-border-soft text-text-body hover:border-teal/40"}`}>
                    {b}
                  </button>
                ))}
              </div>
              <Label>Monthly Order Volume (Estimated)</Label>
              <select className={inputCls}>
                {["0 – 100 orders", "100 – 500 orders", "500 – 2,000 orders", "2,000 – 10,000 orders", "10,000+ orders"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>

            {/* Sales channels */}
            <div className="bg-white rounded-2xl border border-border-soft p-7">
              <h2 className="text-[18px] font-bold text-deep-navy mb-2">Select your sales channels</h2>
              <p className="text-[13px] text-text-muted mb-4">Choose all platforms where you sell today.</p>
              <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
                {channels.map((c) => {
                  const on = picked.includes(c);
                  return (
                    <button key={c} onClick={() => toggle(c)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${on ? "border-teal bg-teal/5" : "border-border-soft hover:border-teal/40"}`}>
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-soft-bg border border-border-soft shrink-0">
                        <BrandLogo name={c} className="w-5 h-5" />
                      </span>
                      <span className="text-[13px] font-medium text-deep-navy flex-1">{c}</span>
                      {on && <Check className="w-4 h-4 text-teal" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-border-soft p-7">
              <h2 className="text-[18px] font-bold text-deep-navy mb-3">Anything else we should know?</h2>
              <textarea rows={3} className="w-full px-4 py-3 rounded-[10px] border border-border-soft text-sm focus:outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-colors resize-none" placeholder="Tell us about your goals, current challenges, or special requirements..." />
            </div>

            {/* Nav */}
            <div className="flex items-center justify-between">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] text-sm font-semibold text-text-muted border border-border-soft hover:bg-soft-bg transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <Link href="/get-started" className="inline-flex items-center gap-2 px-7 py-3 text-sm font-semibold text-white rounded-[10px] gradient-cta hover:shadow-button transition-all">
                Continue <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right tips */}
          <aside>
            <div className="bg-white rounded-2xl border border-border-soft p-5 sticky top-24">
              <p className="text-[14px] font-bold text-deep-navy mb-4">Why set up your profile?</p>
              <div className="space-y-4">
                {benefits.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div key={b.title} className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-lg bg-action-blue/8 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-action-blue" />
                      </span>
                      <div>
                        <p className="text-[13px] font-semibold text-deep-navy">{b.title}</p>
                        <p className="text-[12px] text-text-muted leading-snug mt-0.5">{b.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom trust / social proof bar */}
      <div className="mt-12 border-t border-border-soft bg-white/70 backdrop-blur-sm">
        <div className="max-w-[1240px] mx-auto px-6 py-10 text-center">
          <p className="text-[15px] font-semibold text-deep-navy">
            Thousands of brands trust{" "}
            <span className="text-navy">Fulfill</span><span className="text-teal">Mesh</span>{" "}
            for smarter fulfillment.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {["Visa", "Mastercard", "PayPal", "Stripe"].map((n) => (
              <span key={n} className="opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                <TrustLogo name={n} />
              </span>
            ))}
            {["Shopify", "Amazon", "WooCommerce", "Etsy"].map((n) => (
              <span key={n} className="opacity-60 hover:opacity-100 transition-opacity">
                <BrandLogo name={n} className="h-6 w-auto" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
