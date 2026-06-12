"use client";

import { useMemo } from "react";
import { geoNaturalEarth1, geoPath, geoGraticule10 } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, Geometry, GeoJsonProperties } from "geojson";
import worldTopo from "@/data/countries-110m.json";

type CountryFeature = Feature<Geometry, GeoJsonProperties>;

/* ── canvas ── */
const WIDTH = 760;
const HEIGHT = 440;
const CHINA_ID = "156";                              // ISO 3166-1 numeric
const CHINA_COORD: [number, number] = [104, 35];     // origin hub ≈ China

/* destination pins reached from China (flat map → all visible) */
const PINS: [number, number][] = [
  [139.69, 35.68],   // Tokyo
  [103.85, 1.29],    // Singapore
  [55.27, 25.2],     // Dubai
  [13.4, 52.52],     // Berlin
  [-0.13, 51.51],    // London
  [-74.0, 40.71],    // New York
  [-118.24, 34.05],  // Los Angeles
  [151.21, -33.87],  // Sydney
  [-46.63, -23.55],  // São Paulo
];

/* lucide MapPin path (24×24, tip at 12,22) */
function MapPin({ x, y, h, fill }: { x: number; y: number; h: number; fill: string }) {
  const k = h / 22;
  return (
    <g transform={`translate(${x - 12 * k}, ${y - 22 * k}) scale(${k})`}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill={fill} />
      <circle cx="12" cy="10" r="3" fill="#fff" />
    </g>
  );
}

/* ── component ── */
export default function WorldMap() {
  const countries = useMemo<CountryFeature[]>(() => {
    const topo = worldTopo as unknown as Topology<{ countries: GeometryCollection }>;
    const geo = feature(topo, topo.objects.countries);
    return geo.features;
  }, []);

  const { pathGen, projection } = useMemo(() => {
    const proj = geoNaturalEarth1();
    proj.fitExtent([[6, 14], [WIDTH - 6, HEIGHT - 14]], { type: "Sphere" });
    return { projection: proj, pathGen: geoPath().projection(proj) };
  }, []);

  const spherePath = useMemo(() => pathGen({ type: "Sphere" }) ?? "", [pathGen]);
  const graticulePath = useMemo(() => pathGen(geoGraticule10()) ?? "", [pathGen]);
  const chinaXY = projection(CHINA_COORD);

  const pins = PINS
    .map((c) => ({ c, xy: projection(c) }))
    .filter((p) => p.xy != null) as { c: [number, number]; xy: [number, number] }[];

  /* gentle arc between two points for the connector routes */
  const arc = (a: [number, number], b: [number, number]) => {
    const mx = (a[0] + b[0]) / 2;
    const my = (a[1] + b[1]) / 2;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const dist = Math.hypot(dx, dy);
    // lift the control point perpendicular to the chord
    const cx = mx - dy * 0.18;
    const cy = my + dx * 0.18 - dist * 0.06;
    return `M${a[0]},${a[1]} Q${cx},${cy} ${b[0]},${b[1]}`;
  };

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mapSea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EEF5FD" />
            <stop offset="100%" stopColor="#E2EDF9" />
          </linearGradient>
          <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00B894" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00B894" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* sea / sphere */}
        <path d={spherePath} fill="url(#mapSea)" />

        {/* graticule */}
        {graticulePath && (
          <path d={graticulePath} fill="none" stroke="#CFDEF0" strokeWidth={0.5}
            strokeDasharray="1 4" strokeLinecap="round" opacity={0.7} />
        )}

        {/* countries */}
        {countries.map((c, i) => {
          const d = pathGen(c);
          if (!d) return null;
          const isChina = String(c.id) === CHINA_ID;
          return (
            <path
              key={c.id ?? i}
              d={d as string}
              fill={isChina ? "#00B894" : "#BFD2E8"}
              stroke={isChina ? "#009E80" : "#FFFFFF"}
              strokeWidth={isChina ? 0.6 : 0.5}
            />
          );
        })}

        {/* connector routes China → destinations */}
        {chinaXY && pins.map((p, i) => (
          <path key={`r${i}`} d={arc(chinaXY, p.xy)} fill="none"
            stroke="#00B894" strokeWidth={1.1} strokeDasharray="2 4"
            strokeLinecap="round" opacity={0.55} />
        ))}

        {/* destination pins */}
        {pins.map((p, i) => (
          <g key={`p${i}`}>
            <circle cx={p.xy[0]} cy={p.xy[1]} r={3.2} fill="#0E9E86" />
            <circle cx={p.xy[0]} cy={p.xy[1]} r={6} fill="none" stroke="#0E9E86" strokeWidth={0.8} opacity={0.4} />
          </g>
        ))}

        {/* China origin hub */}
        {chinaXY && (
          <>
            <circle cx={chinaXY[0]} cy={chinaXY[1]} r={34} fill="url(#hubGlow)" />
            <circle cx={chinaXY[0]} cy={chinaXY[1]} r={16} fill="#00B894" opacity={0.14}>
              <animate attributeName="r" values="14;26;14" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.18;0.04;0.18" dur="3s" repeatCount="indefinite" />
            </circle>
            <MapPin x={chinaXY[0]} y={chinaXY[1]} h={28} fill="#00B894" />
          </>
        )}
      </svg>
    </div>
  );
}
