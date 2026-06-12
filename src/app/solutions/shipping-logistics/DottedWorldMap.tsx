/**
 * Page-specific dotted world map.
 * A coarse landmass mask places dots only over continents, producing a
 * recognizable flat world-map silhouette. Used by the hero (with route arcs
 * converging on an FM node) and the "global shipping network" block.
 */

// Coarse equirectangular landmass mask (1 = land, 0 = sea/space).
// 60 columns wide, 30 rows tall — roughly proportional to a 2:1 world map.
const MASK = [
  "000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000",
  "000000111100000011111111111110000000000000000000000000000000",
  "000011111111000111111111111111110000000000000111000000000000",
  "000111111111101111111111111111111100000000011111111000000000",
  "001111111111111111111111111111111110000001111111111110000000",
  "000011111111111111111111111111111110000011111111111111000000",
  "000001111111111111111111111111111000000111111111111111100000",
  "000000111111111111111111111111110000001111111111111111000000",
  "000000011111111111111111111111100000011111111111111110000000",
  "000000001111111111111111111110000000011111111111111100000000",
  "000000000111111111111111111000000000001111111111111000000000",
  "000000000011111111111111100000000000000111111111110000000000",
  "000000000001111111111111000000000000000011111111100000000000",
  "000000000000111111111100000000000000000001111111000000000000",
  "000000000000011111111000000000000000000000111110000000000000",
  "000000000000001111110000000000000000000000011100000000000000",
  "000000000000000111100000000000000000000000001000000000000000",
  "000000000000000011000000000000000000001100000000000000000000",
  "000000000000000000000000000000000000011110000000000000000000",
  "000000000000000000000000000000000001111111000000000000000000",
  "000000000000000000000000000000000011111111000000000000000000",
  "000000000000000000000000000000000001111110000000000000000000",
  "000000000000000000000000000000000000111000000000000000000000",
  "000000000000000000000000000000000000010000000000000000000000",
  "000000000000000000000000000000000000000000000000000000000000",
  "000000000000000000000000000000000000000011110000111000000000",
  "000000000000000000000000000000000000000111111000111100000000",
  "000000000000000000000000000000000000000011100000011000000000",
  "000000000000000000000000000000000000000000000000000000000000",
];

const COLS = 60;
const ROWS = 30;

type Marker = {
  /** 0..1 horizontal, 0..1 vertical within the map box */
  x: number;
  y: number;
  /** tailwind text/fill color for the dot */
  color?: string;
  r?: number;
};

type Arc = { x1: number; y1: number; x2: number; y2: number };

export default function DottedWorldMap({
  width = 500,
  height = 280,
  dotColor = "#B8C7DA",
  markers = [],
  arcs = [],
  hubX,
  hubY,
  className,
}: {
  width?: number;
  height?: number;
  dotColor?: string;
  markers?: Marker[];
  arcs?: Arc[];
  hubX?: number;
  hubY?: number;
  className?: string;
}) {
  const cellW = width / COLS;
  const cellH = height / ROWS;
  const dots: { cx: number; cy: number }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (MASK[r][c] === "1") {
        dots.push({ cx: c * cellW + cellW / 2, cy: r * cellH + cellH / 2 });
      }
    }
  }

  const hubPx = hubX != null ? hubX * width : null;
  const hubPy = hubY != null ? hubY * height : null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* land dots */}
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={1.5} fill={dotColor} />
      ))}

      {/* curved shipping route arcs */}
      {arcs.map((a, i) => {
        const x1 = a.x1 * width;
        const y1 = a.y1 * height;
        const x2 = a.x2 * width;
        const y2 = a.y2 * height;
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.22 - 18;
        return (
          <path
            key={`arc${i}`}
            d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
            stroke="#00B894"
            strokeWidth={1.3}
            strokeDasharray="4 4"
            opacity={0.55}
          />
        );
      })}

      {/* origin->hub straight feed lines */}
      {hubPx != null &&
        hubPy != null &&
        markers
          .filter((m) => m.color === "#00B894")
          .map((m, i) => (
            <line
              key={`feed${i}`}
              x1={hubPx}
              y1={hubPy}
              x2={m.x * width}
              y2={m.y * height}
              stroke="#00B894"
              strokeWidth={1}
              strokeDasharray="3 4"
              opacity={0.35}
            />
          ))}

      {/* location markers */}
      {markers.map((m, i) => (
        <g key={`m${i}`}>
          <circle
            cx={m.x * width}
            cy={m.y * height}
            r={(m.r ?? 3) + 3}
            fill={m.color ?? "#0057D8"}
            opacity={0.15}
          />
          <circle
            cx={m.x * width}
            cy={m.y * height}
            r={m.r ?? 3}
            fill={m.color ?? "#0057D8"}
          />
        </g>
      ))}
    </svg>
  );
}
