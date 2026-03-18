"use client";

import { Download, ImageIcon } from "lucide-react";
import { ProcessResult, ImageType } from "../types/process";
import { saveImage } from "../lib/saveImage";

interface Props {
  file: File | null;
  imageType: ImageType | null;
  imageDimensions: { width: number; height: number } | null;
  result: ProcessResult | null;
}

export default function TopToolbar({
  file,
  imageType,
  imageDimensions,
  result,
}: Props) {
  return (
    <div className="h-10 bg-[#1e1e1e] border-b border-[#3a3a3a] flex items-center px-3 shrink-0 select-none">
      {/* Left: Title */}
      <div className="flex items-center gap-2 flex-1">
        <ImageIcon size={16} className="text-[#4a9eff]" />
        <span className="text-[13px] font-semibold text-[#e0e0e0]">
          PDI
        </span>
        <span className="text-[11px] text-[#666666]">
          Processamento Digital de Imagens
        </span>
      </div>

      {/* Center: Image info */}
      <div className="flex-1 text-center">
        {file && imageDimensions && (
          <span className="text-[11px] text-[#888888]">
            {file.name}
            <span className="mx-2 text-[#3a3a3a]">|</span>
            {imageDimensions.width} x {imageDimensions.height}
            <span className="mx-2 text-[#3a3a3a]">|</span>
            {imageType}
          </span>
        )}
      </div>

      {/* Right: Download buttons */}
      <div className="flex items-center gap-1 flex-1 justify-end">
        {result?.images.map((img, i) => (
          <button
            key={i}
            onClick={() =>
              saveImage(img.data, `${result.process_id}_${img.label}.png`)
            }
            className="flex items-center gap-1 px-2 py-1 text-[11px] text-[#888888] hover:text-[#e0e0e0] hover:bg-[#3a3a3a] rounded transition-colors"
            title={`Download ${img.label}`}
          >
            <Download size={12} />
            {result.images.length > 1 ? img.label : "Download"}
          </button>
        ))}
      </div>
    </div>
  );
}
