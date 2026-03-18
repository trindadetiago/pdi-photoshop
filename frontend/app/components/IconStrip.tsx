"use client";

import {
  Palette,
  SunMedium,
  Grid3X3,
  Waves,
  Zap,
  Upload,
  LucideIcon,
} from "lucide-react";
import { useRef } from "react";
import { CATEGORY_ORDER, CATEGORY_LABELS } from "../types/process";

const ICON_MAP: Record<string, LucideIcon> = {
  decomposition: Palette,
  intensity_transform: SunMedium,
  spatial_filter: Grid3X3,
  frequency_filter: Waves,
  noise: Zap,
};

interface Props {
  activeCategory: string | null;
  onCategorySelect: (cat: string | null) => void;
  onImage: (file: File) => void;
  hasImage: boolean;
}

export default function IconStrip({
  activeCategory,
  onCategorySelect,
  onImage,
  hasImage,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-12 bg-[#1e1e1e] border-r border-[#3a3a3a] flex flex-col items-center py-2 gap-1 shrink-0">
      {CATEGORY_ORDER.map((cat) => {
        const Icon = ICON_MAP[cat];
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onCategorySelect(isActive ? null : cat)}
            disabled={!hasImage}
            className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${
              isActive
                ? "bg-[#4a9eff]/20 text-[#4a9eff]"
                : hasImage
                ? "text-[#888888] hover:text-[#e0e0e0] hover:bg-[#3a3a3a]"
                : "text-[#444444] cursor-not-allowed"
            }`}
            title={CATEGORY_LABELS[cat]}
          >
            <Icon size={20} />
          </button>
        );
      })}

      <div className="flex-1" />

      {/* Upload button at bottom */}
      <button
        onClick={() => inputRef.current?.click()}
        className="w-10 h-10 flex items-center justify-center rounded text-[#888888] hover:text-[#e0e0e0] hover:bg-[#3a3a3a] transition-colors"
        title="Upload image"
      >
        <Upload size={20} />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/bmp,image/tiff"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f && f.type.startsWith("image/")) onImage(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
