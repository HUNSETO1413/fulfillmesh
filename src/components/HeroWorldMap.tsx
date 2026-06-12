/* Page-specific decorative world-map background for the co-build-future hero.
   Renders a faint dotted world silhouette with a node network overlay.
   Not shared chrome — only used by /co-build-future. */
export default function HeroWorldMap() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 500 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="hm-dots" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="1.4" cy="1.4" r="1.4" fill="#B8C7DA" />
        </pattern>
        <radialGradient id="hm-fade" cx="50%" cy="48%" r="62%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="78%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#F7FAFC" stopOpacity="1" />
        </radialGradient>
        {/* world silhouette used to clip the dot pattern into continents */}
        <clipPath id="hm-world">
          {/* North America */}
          <path d="M40 70 Q70 50 110 60 Q150 70 150 110 Q140 150 100 160 Q70 168 55 140 Q35 110 40 70 Z" />
          {/* South America */}
          <path d="M120 195 Q150 185 160 215 Q165 260 140 300 Q120 320 110 290 Q105 245 120 195 Z" />
          {/* Europe */}
          <path d="M225 70 Q260 60 280 78 Q288 100 268 112 Q240 120 225 100 Q218 84 225 70 Z" />
          {/* Africa */}
          <path d="M235 130 Q280 122 300 155 Q310 205 280 255 Q255 285 240 250 Q222 195 235 130 Z" />
          {/* Asia */}
          <path d="M300 60 Q370 48 430 72 Q470 95 445 135 Q400 165 340 150 Q300 130 300 60 Z" />
          {/* Oceania */}
          <path d="M405 235 Q445 225 465 255 Q470 285 435 290 Q405 285 405 235 Z" />
        </clipPath>
      </defs>

      {/* dotted continents */}
      <g clipPath="url(#hm-world)">
        <rect x="0" y="0" width="500" height="360" fill="url(#hm-dots)" />
      </g>

      {/* node network: center hub → four partner regions */}
      {([
        [410, 70],
        [410, 290],
        [90, 70],
        [90, 290],
      ] as [number, number][]).map(([x2, y2], i) => (
        <line
          key={i}
          x1={250}
          y1={180}
          x2={x2}
          y2={y2}
          stroke="#00B894"
          strokeWidth="1.4"
          strokeDasharray="5 5"
          opacity="0.45"
        />
      ))}
      {([
        [410, 70],
        [410, 290],
        [90, 70],
        [90, 290],
      ] as [number, number][]).map(([cx, cy], i) => (
        <circle key={`n${i}`} cx={cx} cy={cy} r="4" fill="#00B894" opacity="0.7" />
      ))}

      {/* soft edge fade */}
      <rect x="0" y="0" width="500" height="360" fill="url(#hm-fade)" />
    </svg>
  );
}
