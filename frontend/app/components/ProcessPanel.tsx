"use client";

import {
  ProcessDefinition,
  ImageType,
  CATEGORY_LABELS,
} from "../types/process";

interface Props {
  category: string;
  catalog: ProcessDefinition[];
  imageType: ImageType | null;
  selectedProcess: ProcessDefinition | null;
  onSelect: (p: ProcessDefinition | null) => void;
}

export default function ProcessPanel({
  category,
  catalog,
  imageType,
  selectedProcess,
  onSelect,
}: Props) {
  const processes = catalog.filter((p) => p.category === category);

  const isApplicable = (p: ProcessDefinition) => {
    if (!imageType) return false;
    return p.applicable_to === "both" || p.applicable_to === imageType;
  };

  return (
    <div className="w-60 bg-[#1e1e1e] border-r border-[#3a3a3a] flex flex-col shrink-0 overflow-hidden">
      <div className="px-3 py-2 border-b border-[#3a3a3a]">
        <h3 className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
          {CATEGORY_LABELS[category] || category}
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto py-1">
        {processes.map((p) => {
          const applicable = isApplicable(p);
          const active = selectedProcess?.id === p.id;
          return (
            <button
              key={p.id}
              disabled={!applicable}
              onClick={() => onSelect(active ? null : p)}
              className={`w-full text-left px-3 py-1.5 text-[12px] transition-colors ${
                active
                  ? "bg-[#4a9eff]/20 text-[#4a9eff]"
                  : applicable
                  ? "text-[#e0e0e0] hover:bg-[#3a3a3a]"
                  : "text-[#444444] cursor-not-allowed"
              }`}
              title={
                !applicable
                  ? `Requires ${p.applicable_to} image`
                  : p.name
              }
            >
              {p.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
