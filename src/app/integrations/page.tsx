import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Search, Check, Plug, ChevronDown } from "lucide-react";

// Real brand logo marks (inline SVG, full color) keyed by integration name.
const brandLogos: Record<string, ReactNode> = {
  Shopify: (
    <svg viewBox="0 0 448 512" className="h-full w-full" aria-hidden="true">
      <path
        fill="#95BF47"
        d="M388.32 104.1a4.66 4.66 0 0 0-4.4-4c-2 0-37.23-.8-37.23-.8s-29.62-28.83-32.83-32 -9.61-2.4-12-1.6c0 0-5.6 1.6-14.81 4.4a103.59 103.59 0 0 0-7.21-17.61C265 34.1 250.18 26.5 232.16 26.5h-2c-.4-.8-1.2-1.2-1.6-2C220.56 16.49 210.95 13.29 199.74 13.69 178.12 14.49 156.5 30.1 138.88 57.71c-12 19.21-21.62 43.23-24.42 62l-42.84 13.21c-12.81 4-13.21 4.4-14.81 16.41C55.6 158.55 22 418.31 22 418.31L302.18 466.74l121.43-30.02C423.61 436.72 388.72 106.5 388.32 104.1zM263.84 73.71c-6.81 2-14.41 4.4-22.42 6.81a103.36 103.36 0 0 0-5.6-26.42c14.41 2.4 21.61 19.21 28.02 19.61zM226.16 84.92c-15.21 4.8-31.62 9.61-48.43 14.81 4.8-18 13.61-36 24.42-48 4-4.4 9.61-9.61 16-12.41C224.96 51.69 226.56 70.5 226.16 84.92zM199.74 33.7a26.42 26.42 0 0 1 15.21 4.4c-6.41 3.2-12.81 8.41-18.81 14.81-14.41 15.61-25.62 40-30 63.62-14 4.4-28 8.41-40.83 12.41C133.27 90.92 164.49 34.5 199.74 33.7z"
      />
      <path
        fill="#5E8E3E"
        d="M383.92 100.1c-2 0-37.23-.8-37.23-.8s-29.62-28.83-32.83-32a8 8 0 0 0-4.4-2L302.18 466.74l121.43-30.02S388.72 106.5 388.32 104.1A4.66 4.66 0 0 0 383.92 100.1z"
      />
      <path
        fill="#FFF"
        d="M232.16 162.55l-14 52.83s-15.61-7.21-34.42-6c-27.62 1.6-27.62 19.21-27.62 23.62 1.6 24 64.84 29.22 68.44 85.65 2.8 44.43-23.62 74.85-61.64 77.25-46 2.8-71.24-24.42-71.24-24.42l9.61-41.63s25.62 19.21 46 18c13.21-.8 18.41-11.61 18-19.21-2-31.62-53.63-29.62-56.84-81.25-2.8-43.23 25.62-87 88.45-90.85C221.36 156.15 232.16 162.55 232.16 162.55z"
      />
    </svg>
  ),
  WooCommerce: (
    <svg viewBox="0 0 256 154" className="h-full w-full" aria-hidden="true">
      <path
        fill="#7F54B3"
        d="M23.76 0h208.32c13.2 0 23.92 10.72 23.92 23.92v79.68c0 13.2-10.72 23.92-23.92 23.92h-74.72l10.24 25.12-45.12-25.12H23.92C10.72 127.52 0 116.8 0 103.6V23.92C-.08 10.72 10.56 0 23.76 0Z"
      />
      <path
        fill="#FFF"
        d="M14.6 21.8c1.46-1.98 3.65-3.02 6.58-3.23 5.33-.42 8.36 2.09 9.09 7.52 3.23 21.78 6.78 40.22 10.55 55.33l22.94-43.67c2.09-3.97 4.7-6.06 7.84-6.27 4.6-.31 7.42 2.61 8.57 8.78 2.61 13.9 5.95 25.71 9.92 35.74 2.71-26.55 7.31-45.72 13.79-57.63 1.57-2.92 3.86-4.39 6.89-4.6 2.4-.21 4.6.52 6.58 2.09 1.98 1.57 3.02 3.55 3.23 5.95.1 1.88-.21 3.44-1.05 5.01-4.07 7.52-7.42 20.16-10.13 37.72-2.61 17.04-3.55 30.31-2.92 39.81.21 2.61-.21 4.91-1.25 6.89-1.25 2.3-3.13 3.55-5.54 3.76-2.71.21-5.54-1.05-8.26-3.86-9.71-9.92-17.46-24.7-23.1-44.34-6.78 13.38-11.81 23.41-15.05 30.1-6.16 11.81-11.39 17.87-15.78 18.18-2.82.21-5.22-2.19-7.31-7.2C29.96 95.66 24.32 65.04 18.36 28.9c-.42-3.34.31-6.27 1.88-8.36Z"
      />
      <path
        fill="#FFF"
        d="M237.92 33.83c-3.65-6.37-9.02-10.24-16.21-11.81-1.88-.42-3.65-.63-5.33-.63-9.71 0-17.6 5.01-23.83 15.05-5.33 8.57-7.94 18.07-7.94 28.42 0 7.73 1.57 14.37 4.7 19.9 3.65 6.37 9.02 10.24 16.21 11.81 1.88.42 3.65.63 5.33.63 9.81 0 17.7-5.01 23.83-15.05 5.33-8.67 7.94-18.18 7.94-28.52 0-7.84-1.57-14.37-4.7-19.8Zm-12.75 27.9c-1.46 6.89-4.07 12-7.94 15.46-3.02 2.71-5.85 3.86-8.46 3.34-2.51-.52-4.6-2.71-6.16-6.78-1.25-3.23-1.88-6.47-1.88-9.5 0-2.61.21-5.22.73-7.62.94-4.28 2.71-8.46 5.54-12.43 3.44-5.12 7.1-7.2 10.86-6.47 2.51.52 4.6 2.71 6.16 6.78 1.25 3.23 1.88 6.47 1.88 9.5 0 2.71-.21 5.32-.73 7.72Z"
      />
      <path
        fill="#FFF"
        d="M173.79 33.83c-3.65-6.37-9.13-10.24-16.21-11.81-1.88-.42-3.65-.63-5.33-.63-9.71 0-17.6 5.01-23.83 15.05-5.33 8.57-7.94 18.07-7.94 28.42 0 7.73 1.57 14.37 4.7 19.9 3.65 6.37 9.02 10.24 16.21 11.81 1.88.42 3.65.63 5.33.63 9.81 0 17.7-5.01 23.83-15.05 5.33-8.67 7.94-18.18 7.94-28.52 0-7.84-1.57-14.37-4.7-19.8Zm-12.85 27.9c-1.46 6.89-4.07 12-7.94 15.46-3.02 2.71-5.85 3.86-8.46 3.34-2.51-.52-4.6-2.71-6.16-6.78-1.25-3.23-1.88-6.47-1.88-9.5 0-2.61.21-5.22.73-7.62.94-4.28 2.71-8.46 5.54-12.43 3.44-5.12 7.1-7.2 10.86-6.47 2.51.52 4.6 2.71 6.16 6.78 1.25 3.23 1.88 6.47 1.88 9.5.1 2.71-.21 5.32-.73 7.72Z"
      />
    </svg>
  ),
  Amazon: (
    <svg viewBox="0 0 256 256" className="h-full w-full" aria-hidden="true">
      <path
        fill="#FF9900"
        d="M158.6 178.3c-14.9 11-36.5 16.8-55.1 16.8-26.1 0-49.6-9.7-67.4-25.7-1.4-1.3-.1-3 1.6-2 19.2 11.2 42.9 17.9 67.4 17.9 16.5 0 34.6-3.4 51.3-10.5 2.5-1.1 4.6 1.6 2.2 3.5z"
      />
      <path
        fill="#FF9900"
        d="M164.8 171.2c-1.9-2.4-12.6-1.1-17.4-.6-1.4.2-1.7-1.1-.4-2 8.5-6 22.5-4.3 24.1-2.3 1.6 2.1-.4 16.1-8.4 22.8-1.2 1-2.4.5-1.9-.9 1.8-4.6 5.9-15 4-16z"
      />
      <path
        fill="#221F1F"
        d="M147.7 19.4l2.3-12.4c0-1.1-.8-1.9-1.8-1.9l-55.6 0c-1 0-1.9.8-1.9 1.8v10.6c0 1.1.9 1.9 1.9 1.9h29.1l-33.4 47.8c-2.2 3.2-2.2 6.9 0 9.6l2.3 2.9c1.6 2 4 1.7 5.5.3 8.5-8.3 18.7-13.7 30-13.7 11.3 0 19.4 5.3 27.9 13.6 1.6 1.5 4 1.8 5.6-.2l2.6-3.3c2-2.5 1.9-6.1-.1-8.6l-26.3-31.5 26.4-.2c1.1 0 1.9-.8 1.9-1.9l-1.9-12.7z"
      />
    </svg>
  ),
  Salesforce: (
    <svg viewBox="0 0 256 180" className="h-full w-full" aria-hidden="true">
      <path
        fill="#00A1E0"
        d="M106.4 19.6c8.2-8.6 19.7-13.9 32.3-13.9 16.8 0 31.4 9.4 39.2 23.3 6.8-3 14.3-4.7 22.2-4.7 30.4 0 55 24.8 55 55.4s-24.6 55.4-55 55.4c-3.7 0-7.3-.4-10.8-1.1-6.9 12.3-20 20.6-35.1 20.6-6.3 0-12.3-1.5-17.6-4.1-7 16.4-23.2 27.9-42.2 27.9-19.8 0-36.6-12.5-43.1-30-2.8.6-5.8.9-8.8.9C20.6 149.2 0 128.4 0 102.8c0-17.2 9.3-32.2 23.1-40.3-2.8-6.5-4.4-13.7-4.4-21.3C18.7 18.4 37.1 0 59.8 0c13.3 0 25.2 6.4 32.7 16.2 4.3-3.6 9.3-6.4 14.8-8.3-.3 3.9-.9 7.7-.9 11.7z"
      />
    </svg>
  ),
  BigCommerce: (
    <svg viewBox="0 0 256 198" className="h-full w-full" aria-hidden="true">
      <path
        fill="#121118"
        d="M243.6 6.6 89.2 161.1h45.3c4.3 0 8.1 2.4 9.9 6.1l-58.5 28.5L255 80.8V18.2c0-6.4-5.2-11.6-11.4-11.6z"
        opacity=".75"
      />
      <path
        fill="#121118"
        d="M134.4 88.7h32.6c8.1 0 13.2 4.5 13.2 11.3 0 7.2-5.1 11.3-13.2 11.3h-32.6V88.7zm0-39.6h31.5c7.3 0 12.1 4 12.1 10.6 0 6.8-4.8 10.6-12.1 10.6h-31.5V49.1zM112 6.6H11.4C5.2 6.6 0 11.8 0 18.2v178.1h93.9l63.2-63.4c1.6-7.4-1.4-15.2-8.2-19.5 7.4-4.6 11.9-12.8 11.9-21.7 0-21.7-16.8-28.6-31.8-28.6L112 6.6z"
      />
    </svg>
  ),
  eBay: (
    <svg viewBox="0 0 256 102" className="h-full w-full" aria-hidden="true">
      <path fill="#E53238" d="M28.7 31.6C12.9 31.6 0 38.3 0 58.4c0 16 8.8 26 28.9 26 23.7 0 25.2-15.6 25.2-15.6H42.5s-2.5 8.5-14.3 8.5c-9.7 0-16.6-6.5-16.6-15.7h43.6v-5.9c0-9.2-5.9-24.1-26.5-24.1zm-.4 7.3c9.2 0 15.5 5.6 15.5 14.1H11.9c0-9 8.2-14.1 16.4-14.1z" />
      <path fill="#0064D2" d="M55.1 6.5v66.7c0 3.8-.3 9.1-.3 9.1H66s.4-3.8.4-7.3c0 0 5.6 8.8 20.9 8.8 16.1 0 27-11.2 27-27.2 0-14.9-10.1-26.9-27-26.9-15.9 0-20.8 8.6-20.8 8.6V6.5H55.1zm28.7 32.6c10.9 0 17.8 8.1 17.8 19.4 0 12.2-8 19.7-17.7 19.7-11.6 0-17.9-9.1-17.9-19.6 0-9.8 5.6-19.5 17.8-19.5z" />
      <path fill="#F5AF02" d="M126.1 33.1c-23.4 0-24.9 12.8-24.9 14.9h11.9s.6-7.7 12.2-7.7c7.5 0 13.4 3.4 13.4 10v2.5h-13.4c-17.8 0-27.2 5.2-27.2 15.8 0 10.4 8.7 16.1 20.5 16.1 16.1 0 21.3-8.9 21.3-8.9 0 3.9.3 7.7.3 7.7h10.6s-.4-4.7-.4-7.8V57.2c0-17.2-13.9-24.1-24.8-24.1h-.1zm12.6 26.8v3.3c0 4.3-2.7 15-18.4 15-8.6 0-12.3-4.3-12.3-9.3 0-9.1 12.5-9 30.7-9z" />
      <path fill="#86B817" d="M150.6 35.2h13.4l19.2 38.5 19.2-38.5h12.1L179.5 102h-12.7l10.1-19.1z" />
    </svg>
  ),
  Etsy: (
    <svg viewBox="0 0 256 256" className="h-full w-full" aria-hidden="true">
      <rect width="256" height="256" rx="40" fill="#F1641E" />
      <path
        fill="#FFF"
        d="M101.6 71.4v52.4c0 1.3.6 1.9 1.9 1.9h22.6c12.3 0 18.5-2.3 22-15.5.5-1.9.9-2.6 2.4-2.4 1.4.2 1.7 1 1.5 2.9-.6 6.6-1.6 18.6-1.6 22.9 0 4.3.9 16.7 1.4 23 .1 1.9-.2 2.6-1.5 2.8-1.4.2-1.9-.5-2.4-2.4-3.3-12.8-9.6-15.2-21.8-15.2h-22.6c-1.3 0-1.9.6-1.9 1.9v36.4c0 14.4 3.3 17.3 21.8 17.3h17.7c20.3 0 30.5-3.4 39.3-25.3.7-1.7 1.5-2.4 3-1.9 1.5.5 1.7 1.5 1.2 3.5-1.4 5.7-7.4 25.7-9.4 31.5-.7 2.1-1.9 2.6-4.8 2.6H80.8c-1.9 0-2.6-1-2.6-2.4 0-1.5 1-2.1 3.8-2.6 13.6-2.6 15-3.8 15-18.2V90.5c0-14.4-1.4-15.7-15-18.2-2.9-.5-3.8-1.2-3.8-2.6 0-1.4.7-2.4 2.6-2.4h89.4c2.4 0 3.6.7 4 2.9 1 4.8 4.3 22.4 5 27.1.2 1.9 0 2.9-1.4 3.3-1.2.5-2.1-.2-3.1-2.4-7.6-16.9-15.9-22.4-35.2-22.4h-37.9z"
      />
    </svg>
  ),
  Walmart: (
    <svg viewBox="0 0 256 256" className="h-full w-full" aria-hidden="true">
      <g fill="#0071CE">
        <path d="M128 0c-6.6 0-12 4.6-12 10.3l3.9 44.4c.3 3.7 3.9 6.6 8.1 6.6s7.8-2.9 8.1-6.6L140 10.3C140 4.6 134.6 0 128 0z" />
        <path d="M128 194.7c-4.2 0-7.8 2.9-8.1 6.6L116 245.7c0 5.7 5.4 10.3 12 10.3s12-4.6 12-10.3l-3.9-44.4c-.3-3.7-3.9-6.6-8.1-6.6z" />
        <path d="M199.8 41.5c-5.7-3.3-12.7-1.6-15.6 3.6l-19.7 40c-1.6 3.3-.5 7.5 3.1 9.6 3.6 2.1 7.9 1.2 9.9-2l27.5-35.2c2.9-5 1.6-12.6-5.2-16z" />
        <path d="M78.4 161.3c-3.6-2.1-7.9-1.2-9.9 2l-27.5 35.2c-2.9 5-1.6 12.6 5.2 16 5.7 3.3 12.7 1.6 15.6-3.6l19.7-40c1.6-3.3.5-7.5-3.1-9.6z" />
        <path d="M204.5 113.6c-2.1-3.6-6.3-4.7-9.6-3.1l-40 19.7c-3.3 1.6-4.7 5.7-3.6 9.5 1.2 3.7 4.8 6 8.7 5.4l43.5-6.3c5.7-1.6 9.3-8.4 6-16-.9-3-3.4-7.4-5.4-9.1z" />
        <path d="M104.7 117c-1.2-3.7-4.8-6-8.7-5.4l-43.5 6.3c-5.7 1.6-9.3 8.4-6 16 3.3 7.6 11.1 8.1 16.3 5.5l40-19.7c3.3-1.6 4.7-5.7 1.9-2.7z" />
        <path d="M51.5 41.5c-6.8 3.4-8.1 11-5.2 16l27.5 35.2c2 3.2 6.3 4.1 9.9 2 3.6-2.1 4.7-6.3 3.1-9.6l-19.7-40c-2.9-5.2-9.9-6.9-15.6-3.6z" />
        <path d="M210 198.5l-27.5-35.2c-2-3.2-6.3-4.1-9.9-2-3.6 2.1-4.7 6.3-3.1 9.6l19.7 40c2.9 5.2 9.9 6.9 15.6 3.6 6.8-3.4 8.1-11 5.2-16z" />
      </g>
    </svg>
  ),
  ShipStation: (
    <svg viewBox="0 0 256 256" className="h-full w-full" aria-hidden="true">
      <rect width="256" height="256" rx="48" fill="#0BA75C" />
      <path
        fill="#FFF"
        d="M128 56l60 30v50c0 38-25 60-60 74-35-14-60-36-60-74V86l60-30zm0 26-36 18v36c0 23 14 38 36 47 22-9 36-24 36-47v-36l-36-18z"
      />
      <path fill="#FFF" d="M118 116h20v60h-20zm-24 12h20v48H94zm48 0h20v48h-20z" />
    </svg>
  ),
  EasyPost: (
    <svg viewBox="0 0 256 256" className="h-full w-full" aria-hidden="true">
      <rect width="256" height="256" rx="48" fill="#0057D8" />
      <path
        fill="#FFF"
        d="M64 84l64-32 64 32v52l-64 32-64-32V84zm64-8l-40 20 40 20 40-20-40-20zm-48 36v32l40 20v-32l-40-20zm96 0l-40 20v32l40-20v-32z"
      />
    </svg>
  ),
  Slack: (
    <svg viewBox="0 0 256 256" className="h-full w-full" aria-hidden="true">
      <path fill="#36C5F0" d="M99.4 151.2c0 14.4-11.7 26.1-26.1 26.1S47.2 165.6 47.2 151.2s11.7-26.1 26.1-26.1h26.1v26.1zm13.1 0c0-14.4 11.7-26.1 26.1-26.1s26.1 11.7 26.1 26.1v65.3c0 14.4-11.7 26.1-26.1 26.1s-26.1-11.7-26.1-26.1v-65.3z" transform="translate(-30 -100)" />
      <path fill="#E01E5A" d="M73.3 47.2c-14.4 0-26.1 11.7-26.1 26.1s11.7 26.1 26.1 26.1h26.1V73.3c0-14.4-11.7-26.1-26.1-26.1zm0 69.7c-14.4 0-26.1 11.7-26.1 26.1s11.7 26.1 26.1 26.1h65.4c14.4 0 26.1-11.7 26.1-26.1s-11.7-26.1-26.1-26.1H73.3z" transform="translate(-15 65)" />
      <g>
        <path fill="#36C5F0" d="M73.3 47.2c-14.4 0-26.1 11.7-26.1 26.1s11.7 26.1 26.1 26.1h26.1V73.3c0-14.4-11.7-26.1-26.1-26.1z" transform="translate(15 15)" />
        <path fill="#2EB67D" d="M208.8 104.8c14.4 0 26.1-11.7 26.1-26.1s-11.7-26.1-26.1-26.1-26.1 11.7-26.1 26.1v26.1h26.1zm-13.1 0c0 14.4-11.7 26.1-26.1 26.1s-26.1-11.7-26.1-26.1V39.5c0-14.4 11.7-26.1 26.1-26.1s26.1 11.7 26.1 26.1v65.3z" />
        <path fill="#ECB22E" d="M169.5 234.9c14.4 0 26.1-11.7 26.1-26.1s-11.7-26.1-26.1-26.1h-26.1v26.1c0 14.4 11.7 26.1 26.1 26.1zm0-69.7c14.4 0 26.1-11.7 26.1-26.1s-11.7-26.1-26.1-26.1h-65.3c-14.4 0-26.1 11.7-26.1 26.1s11.7 26.1 26.1 26.1h65.3z" />
        <path fill="#E01E5A" d="M39.5 138.9c-14.4 0-26.1 11.7-26.1 26.1s11.7 26.1 26.1 26.1 26.1-11.7 26.1-26.1v-26.1H39.5zm13.1 0c0-14.4 11.7-26.1 26.1-26.1s26.1 11.7 26.1 26.1v65.3c0 14.4-11.7 26.1-26.1 26.1s-26.1-11.7-26.1-26.1v-65.3z" transform="translate(60 4)" />
      </g>
    </svg>
  ),
  Zapier: (
    <svg viewBox="0 0 256 256" className="h-full w-full" aria-hidden="true">
      <path
        fill="#FF4F00"
        d="M160 128c0 9.2-1.7 18-4.7 26.1-8.1 3.1-16.9 4.7-26.1 4.7h-2.4c-9.2 0-18-1.7-26.1-4.7-3.1-8.1-4.7-16.9-4.7-26.1v-2.4c0-9.2 1.7-18 4.7-26.1 8.1-3.1 16.9-4.7 26.1-4.7h2.4c9.2 0 18 1.7 26.1 4.7 3.1 8.1 4.7 16.9 4.7 26.1v2.4zM247 110.6h-65.3l46.2-46.2c-3.6-5.1-7.6-9.9-11.9-14.4l-.1-.1c-4.5-4.4-9.3-8.4-14.4-11.9l-46.2 46.2V18.9c-6.1-1-12.4-1.6-18.8-1.6h-.2c-6.4 0-12.7.6-18.8 1.6v65.3L71.3 38C66.2 41.6 61.4 45.6 56.9 50l-.1.1c-4.4 4.5-8.4 9.3-11.9 14.4l46.2 46.2H25.8c0 .1-1.6 12.5-1.6 18.9v.1c0 6.4.6 12.7 1.6 18.8h65.3L44.9 195c7.1 10.1 15.8 18.8 25.9 25.9l46.2-46.2v65.3c6.1 1 12.4 1.6 18.8 1.6h.3c6.4 0 12.7-.5 18.8-1.6v-65.3l46.2 46.2c5.1-3.6 9.9-7.6 14.4-11.9l.1-.1c4.4-4.5 8.4-9.3 11.9-14.4l-46.2-46.2H247c1-6.1 1.6-12.4 1.6-18.8v-.3c0-6.4-.5-12.6-1.6-18.6z"
      />
    </svg>
  ),
  HubSpot: (
    <svg viewBox="0 0 256 256" className="h-full w-full" aria-hidden="true">
      <path
        fill="#FF7A59"
        d="M191 90.7V66.4a18.7 18.7 0 0 0 10.8-16.9v-.6a18.7 18.7 0 0 0-18.7-18.7h-.6a18.7 18.7 0 0 0-18.7 18.7v.6A18.7 18.7 0 0 0 174.6 66.4v24.3a52.9 52.9 0 0 0-25.2 11.1L82.8 50.9a21 21 0 1 0-9.8 12.6l65.4 50.9a53 53 0 0 0 .8 59.7l-19.9 19.9a17.1 17.1 0 1 0 11.7 11.7l19.7-19.7a53 53 0 1 0 40.5-95.3zm-9.5 79.6a27.2 27.2 0 1 1 0-54.4 27.2 27.2 0 0 1 0 54.4z"
      />
    </svg>
  ),
};

function BrandLogo({ name }: { name: string }) {
  return <span className="block h-7 w-7">{brandLogos[name] ?? null}</span>;
}

const filterTabs = [
  { label: "All Integrations", active: true },
  { label: "E-commerce", active: false },
  { label: "Marketplaces", active: false },
  { label: "Shipping", active: false },
  { label: "CRM & Marketing", active: false },
  { label: "Other", active: false },
];

const featured = [
  { name: "Shopify", desc: "Sync orders, inventory, and tracking in real time.", connected: true, logo: "S", color: "#95BF47" },
  { name: "WooCommerce", desc: "Automate fulfillment and keep customers updated.", connected: false, logo: "W", color: "#7F54B3" },
  { name: "Amazon", desc: "Seamlessly manage orders and inventory.", connected: false, logo: "a", color: "#FF9900" },
  { name: "Salesforce", desc: "Keep customer and order data in sync.", connected: false, logo: "SF", color: "#00A1E0" },
];

const all = [
  { name: "BigCommerce", desc: "Connect your store and automate fulfillment.", connected: false, logo: "B", color: "#121118" },
  { name: "eBay", desc: "Streamline order sync and shipment updates.", connected: false, logo: "e", color: "#E53238" },
  { name: "Etsy", desc: "Simplify order management and fulfillment.", connected: false, logo: "E", color: "#F1641E" },
  { name: "Walmart", desc: "Integrate and fulfill orders from Walmart.", connected: false, logo: "W", color: "#0071CE" },
  { name: "ShipStation", desc: "Import orders and compare shipping rates.", connected: false, logo: "SS", color: "#0BA75C" },
  { name: "EasyPost", desc: "Access powerful shipping APIs and tools.", connected: false, logo: "EP", color: "#0057D8" },
  { name: "Slack", desc: "Get real-time notifications and updates.", connected: true, logo: "#", color: "#E01E5A" },
  { name: "Zapier", desc: "Automate workflows between FulfillMesh and 5,000+ apps.", connected: false, logo: "Z", color: "#FF4F00" },
];

function LogoMark({ name }: { name: string }) {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f1f5f9]">
      <BrandLogo name={name} />
    </div>
  );
}

function IntegrationCard({
  item,
}: {
  item: { name: string; desc: string; connected: boolean; logo: string; color: string };
}) {
  return (
    <div className="flex flex-col rounded-xl border border-[#E2E8F0] bg-white p-6 transition-shadow hover:shadow-md">
      <LogoMark name={item.name} />
      <h3 className="mt-4 text-base font-semibold text-[#1e293b]">{item.name}</h3>
      <p className="mt-1.5 flex-1 text-sm text-[#64748b] leading-relaxed">{item.desc}</p>
      {item.connected ? (
        <span className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-md bg-[#10b981] px-2 py-1 text-xs font-medium text-white">
          <Check className="w-3.5 h-3.5" strokeWidth={3} /> Connected
        </span>
      ) : (
        <button className="mt-4 w-full rounded-md bg-[#3b82f6] py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2563eb]">
          Connect
        </button>
      )}
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-soft-bg">
        <div className="max-w-[1200px] mx-auto px-8 py-12">
          <nav className="text-sm text-[#64748b]">
            <Link href="/" className="hover:text-[#3b82f6]">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/resources" className="hover:text-[#3b82f6]">Resources</Link>
            <span className="mx-2">›</span>
            <span className="text-[#1e293b]">Integration Marketplace</span>
          </nav>

          <div className="mt-8 flex items-center justify-between gap-10">
            <div className="max-w-[520px]">
              <h1 className="text-[40px] leading-tight font-bold text-[#1e293b]">
                Integration Marketplace
              </h1>
              <p className="mt-4 text-lg text-[#64748b] leading-relaxed">
                Connect FulfillMesh with the tools you already use. Seamlessly sync data, automate workflows, and scale your operations.
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-lg border border-[#e2e8f0] bg-white px-4 py-3 max-w-[440px]">
                <Search className="w-5 h-5 text-[#94a3b8]" />
                <input
                  type="text"
                  placeholder="Search integrations..."
                  className="flex-1 bg-transparent text-sm text-[#1e293b] outline-none placeholder:text-[#94a3b8]"
                />
              </div>
            </div>
            <div className="shrink-0 hidden lg:flex">
              <LogoCluster />
            </div>
          </div>

          {/* Filter tabs */}
          <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-[#e2e8f0] pt-5">
            {filterTabs.map((t) => (
              <button
                key={t.label}
                className={`text-sm font-medium transition-colors pb-1 ${
                  t.active
                    ? "text-[#1e3a8a] border-b-2 border-[#1e3a8a]"
                    : "text-[#475569] hover:text-[#1e3a8a]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Integrations */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-8 pt-12 pb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#1e293b]">Featured Integrations</h2>
            <Link href="#" className="text-sm font-semibold text-[#3b82f6] hover:underline">View all</Link>
          </div>
          <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((item) => (
              <IntegrationCard key={item.name} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* All Integrations */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-8 pt-8 pb-16">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#1e293b]">All Integrations</h2>
            <div className="inline-flex items-center gap-2 rounded-md border border-[#e2e8f0] px-3 py-2 text-sm text-[#475569]">
              Sort by: <span className="font-medium text-[#1e293b]">Popular</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {all.map((item) => (
              <IntegrationCard key={item.name} item={item} />
            ))}
          </div>

          {/* Request band */}
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 rounded-xl bg-[#1e3a8a] px-8 py-7">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                <Plug className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Can&apos;t find the integration you need?</h3>
                <p className="mt-1 text-sm text-white/80 leading-relaxed">
                  Request a new integration and help us build what you need.
                </p>
              </div>
            </div>
            <Link
              href="/contact"
              className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-[#3b82f6] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2563eb]"
            >
              Request Integration <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function LogoCluster() {
  // Dense logo cluster radiating from the central FM node, matching the design.
  // Each chip carries its own size so the cluster reads as a tight constellation.
  const W = 420;
  const H = 260;
  const cx = W / 2;
  const cy = H / 2;
  const chips: { name: string; x: number; y: number; size: number }[] = [
    { name: "Shopify", x: 196, y: 22, size: 50 },
    { name: "WooCommerce", x: 268, y: 16, size: 44 },
    { name: "Amazon", x: 330, y: 58, size: 48 },
    { name: "Salesforce", x: 104, y: 70, size: 46 },
    { name: "HubSpot", x: 350, y: 134, size: 44 },
    { name: "eBay", x: 88, y: 150, size: 48 },
    { name: "Etsy", x: 296, y: 196, size: 46 },
    { name: "Slack", x: 168, y: 210, size: 44 },
    { name: "Zapier", x: 240, y: 200, size: 40 },
  ];
  const fmSize = 84;
  return (
    <div style={{ position: "relative", width: W, height: H }}>
      {/* soft backdrop blob */}
      <div
        style={{
          position: "absolute",
          left: cx - 150,
          top: cy - 110,
          width: 300,
          height: 220,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,87,216,0.07) 0%, rgba(0,87,216,0) 70%)",
        }}
      />
      {/* connector lines from center to each chip */}
      <svg style={{ position: "absolute", left: 0, top: 0, width: W, height: H, pointerEvents: "none" }}>
        {chips.map((c, i) => (
          <line
            key={`ln${i}`}
            x1={cx}
            y1={cy}
            x2={c.x + c.size / 2}
            y2={c.y + c.size / 2}
            stroke="#C7D7EC"
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
        ))}
        {/* small connection dots where lines meet chips */}
        {chips.map((c, i) => (
          <circle key={`dot${i}`} cx={c.x + c.size / 2} cy={c.y + c.size / 2} r="2.5" fill="#0057D8" opacity="0.35" />
        ))}
      </svg>
      {/* satellite chips */}
      {chips.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: c.x,
            top: c.y,
            width: c.size,
            height: c.size,
            borderRadius: 14,
            background: "#fff",
            border: "1px solid #E6EDF5",
            boxShadow: "0 8px 22px rgba(3,18,46,0.10)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: c.size * 0.22,
          }}
        >
          <BrandLogo name={c.name} />
        </div>
      ))}
      {/* center FM node — largest, teal accent ring */}
      <div
        style={{
          position: "absolute",
          left: cx - fmSize / 2,
          top: cy - fmSize / 2,
          width: fmSize,
          height: fmSize,
          borderRadius: 22,
          background: "#fff",
          boxShadow: "0 16px 40px rgba(0,87,216,0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: fmSize - 14,
            height: fmSize - 14,
            borderRadius: 16,
            background: "linear-gradient(135deg, #00B894 0%, #009e80 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontWeight: 800, fontSize: 28, color: "#fff", letterSpacing: "-0.02em" }}>FM</span>
        </div>
      </div>
    </div>
  );
}
