"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ParamDefinition, HistogramData } from "../types/process";

interface Props {
  params: ParamDefinition[];
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
  histograms: HistogramData | null;
}

function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#3a3a3a]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-1 px-3 py-2 text-[11px] font-semibold text-[#888888] uppercase tracking-wider hover:bg-[#3a3a3a]/50 transition-colors"
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        {title}
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}

export default function PropertiesPanel({
  params,
  values,
  onChange,
  histograms,
}: Props) {
  const toChartData = (data: number[]) =>
    data.map((count, intensity) => ({ intensity, count }));

  return (
    <div className="w-70 bg-[#1e1e1e] border-l border-[#3a3a3a] flex flex-col shrink-0 overflow-y-auto">
      {params.length > 0 && (
        <Section title="Parameters">
          <div className="space-y-3">
            {params.map((p) => (
              <div key={p.name} className="space-y-1">
                <label className="text-[11px] text-[#888888] flex items-center justify-between">
                  <span>{p.label}</span>
                  {(p.type === "int" || p.type === "float") && (
                    <span className="text-[#4a9eff] font-mono text-[10px]">
                      {values[p.name] !== undefined
                        ? String(values[p.name])
                        : ""}
                    </span>
                  )}
                </label>

                {(p.type === "int" || p.type === "float") && (
                  <input
                    type="range"
                    min={p.min ?? 0}
                    max={p.max ?? 100}
                    step={p.step ?? (p.type === "int" ? 1 : 0.1)}
                    value={Number(values[p.name] ?? p.default ?? 0)}
                    onChange={(e) => {
                      const v =
                        p.type === "int"
                          ? parseInt(e.target.value)
                          : parseFloat(e.target.value);
                      onChange(p.name, v);
                    }}
                    className="w-full"
                  />
                )}

                {p.type === "bool" && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(values[p.name] ?? p.default ?? false)}
                      onChange={(e) => onChange(p.name, e.target.checked)}
                      className="accent-[#4a9eff] w-3.5 h-3.5"
                    />
                    <span className="text-[11px] text-[#e0e0e0]">
                      {p.description || "Enabled"}
                    </span>
                  </label>
                )}

                {p.type === "select" && p.options && (
                  <select
                    value={String(values[p.name] ?? p.default ?? "")}
                    onChange={(e) => onChange(p.name, e.target.value)}
                    className="w-full bg-[#2d2d2d] text-[#e0e0e0] text-[11px] rounded px-2 py-1.5 border border-[#3a3a3a] outline-none focus:border-[#4a9eff]"
                  >
                    {p.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {histograms && (
        <Section title="Histograms">
          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-[#666666] mb-1">Before</p>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={toChartData(histograms.before)}>
                  <XAxis
                    dataKey="intensity"
                    tick={false}
                    axisLine={{ stroke: "#3a3a3a" }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#2d2d2d",
                      border: "1px solid #3a3a3a",
                      borderRadius: 4,
                      fontSize: 10,
                      color: "#e0e0e0",
                    }}
                  />
                  <Bar dataKey="count" fill="#666666" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div>
              <p className="text-[10px] text-[#666666] mb-1">After</p>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={toChartData(histograms.after)}>
                  <XAxis
                    dataKey="intensity"
                    tick={false}
                    axisLine={{ stroke: "#3a3a3a" }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#2d2d2d",
                      border: "1px solid #3a3a3a",
                      borderRadius: 4,
                      fontSize: 10,
                      color: "#e0e0e0",
                    }}
                  />
                  <Bar dataKey="count" fill="#4a9eff" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Section>
      )}

      {params.length === 0 && !histograms && (
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-[11px] text-[#444444] text-center">
            Select a process to see its parameters
          </p>
        </div>
      )}
    </div>
  );
}
