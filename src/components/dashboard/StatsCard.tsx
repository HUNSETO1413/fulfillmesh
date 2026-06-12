"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  period?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconBg = "bg-[#3B82F6]/10",
  iconColor = "text-[#3B82F6]",
  period,
}: StatsCardProps) {
  const isPositive = changeType === "positive";
  const isNegative = changeType === "negative";

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-[0_1px_2px_rgba(16,24,40,0.05)]">
      <div className="flex items-start justify-between mb-3">
        <span className="text-[13px] font-medium text-[#64748B]">{title}</span>
        <div
          className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}
        >
          <Icon className={`w-[18px] h-[18px] ${iconColor}`} />
        </div>
      </div>
      <p className="text-[28px] leading-none font-bold text-[#0F172A]">
        {value}
      </p>
      {change && (
        <div className="flex items-center gap-2 mt-3">
          <span
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[12px] font-semibold ${
              isPositive
                ? "bg-[#10B981]/10 text-[#10B981]"
                : isNegative
                ? "bg-[#EF4444]/10 text-[#EF4444]"
                : "bg-[#94A3B8]/10 text-[#94A3B8]"
            }`}
          >
            {isPositive && <ArrowUpRight className="w-3 h-3" />}
            {isNegative && <ArrowDownRight className="w-3 h-3" />}
            {change}
          </span>
          {period && (
            <span className="text-[12px] text-[#94A3B8]">{period}</span>
          )}
        </div>
      )}
    </div>
  );
}
