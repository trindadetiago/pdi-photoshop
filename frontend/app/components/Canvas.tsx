"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { ProcessResult } from "../types/process";

interface Props {
  preview: string | null;
  result: ProcessResult | null;
  processing: boolean;
  error: string | null;
  onImage: (file: File) => void;
  onClearError: () => void;
}

function ComparisonSlider({
  original,
  resultSrc,
}: {
  original: string;
  resultSrc: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current || !dragging.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPos((x / rect.width) * 100);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const onUp = () => {
      dragging.current = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [handleMove]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden"
    >
      {/* Original (full) */}
      <img
        src={original}
        alt="Original"
        className="absolute inset-0 w-full h-full object-contain"
        draggable={false}
      />
      {/* Result (clipped) */}
      <img
        src={resultSrc}
        alt="Result"
        className="absolute inset-0 w-full h-full object-contain"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        draggable={false}
      />
      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/80 pointer-events-none"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      />
      {/* Draggable handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-white/80 shadow-lg cursor-ew-resize flex items-center justify-center z-10"
        style={{ left: `${pos}%`, transform: "translate(-50%, -50%)" }}
        onMouseDown={() => {
          dragging.current = true;
        }}
        onTouchStart={() => {
          dragging.current = true;
        }}
      >
        <div className="flex gap-0.5">
          <div className="w-0.5 h-3 bg-gray-400 rounded" />
          <div className="w-0.5 h-3 bg-gray-400 rounded" />
        </div>
      </div>
      {/* Labels */}
      <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-white/80">
        Result
      </div>
      <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-white/80">
        Original
      </div>
    </div>
  );
}

function GridView({
  original,
  images,
}: {
  original: string;
  images: { label: string; data: string }[];
}) {
  const cols = images.length <= 2 ? 2 : images.length <= 4 ? 2 : 3;

  return (
    <div className="w-full h-full overflow-y-auto p-4">
      <div className="mb-3">
        <p className="text-[10px] text-[#666666] mb-1">Original</p>
        <img
          src={original}
          alt="Original"
          className="max-h-48 object-contain rounded bg-[#1e1e1e]"
        />
      </div>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {images.map((img, i) => (
          <div key={i}>
            <p className="text-[10px] text-[#666666] mb-1">{img.label}</p>
            <img
              src={`data:image/png;base64,${img.data}`}
              alt={img.label}
              className="w-full object-contain rounded bg-[#1e1e1e]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Canvas({
  preview,
  result,
  processing,
  error,
  onImage,
  onClearError,
}: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f && f.type.startsWith("image/")) onImage(f);
    },
    [onImage]
  );

  const resultImages = result?.images ?? [];
  const isSingle = resultImages.length === 1;
  const isMulti = resultImages.length > 1;

  // Empty state
  if (!preview) {
    return (
      <div
        className="flex-1 bg-[#2d2d2d] flex items-center justify-center relative"
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <div
          className={`flex flex-col items-center gap-3 cursor-pointer transition-colors ${
            dragging ? "opacity-100" : "opacity-60"
          }`}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={48} className="text-[#555555]" />
          <p className="text-[13px] text-[#555555]">
            Drop an image here or click to upload
          </p>
          <p className="text-[11px] text-[#444444]">
            PNG, JPEG, BMP, TIFF
          </p>
        </div>
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
        {dragging && (
          <div className="absolute inset-0 border-2 border-dashed border-[#4a9eff] bg-[#4a9eff]/5 pointer-events-none rounded" />
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#2d2d2d] relative overflow-hidden flex flex-col">
      {/* Error toast */}
      {error && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-[#ff5555]/90 text-white text-[12px] px-3 py-1.5 rounded flex items-center gap-2">
          <span>{error}</span>
          <button onClick={onClearError} className="hover:text-white/80">
            <X size={12} />
          </button>
        </div>
      )}

      {/* Processing overlay */}
      {processing && (
        <div className="absolute inset-0 z-10 bg-[#2d2d2d]/70 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={32} className="text-[#4a9eff] animate-spin" />
            <span className="text-[12px] text-[#888888]">Processing...</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isSingle && preview ? (
          <ComparisonSlider
            original={preview}
            resultSrc={`data:image/png;base64,${resultImages[0].data}`}
          />
        ) : isMulti && preview ? (
          <GridView original={preview} images={resultImages} />
        ) : (
          /* Just the original image */
          <div className="w-full h-full flex items-center justify-center p-4">
            <img
              src={preview}
              alt="Original"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}
