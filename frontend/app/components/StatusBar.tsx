"use client";

import { ProcessDefinition, ProcessResult } from "../types/process";

interface Props {
  processing: boolean;
  selectedProcess: ProcessDefinition | null;
  error: string | null;
  result: ProcessResult | null;
}

export default function StatusBar({
  processing,
  selectedProcess,
  error,
  result,
}: Props) {
  return (
    <div className="h-6 bg-[#1e1e1e] border-t border-[#3a3a3a] flex items-center px-3 text-[11px] shrink-0 select-none">
      <span className="text-[#888888] flex-1">
        {error ? (
          <span className="text-[#ff5555]">{error}</span>
        ) : processing ? (
          "Processing..."
        ) : (
          "Ready"
        )}
      </span>
      <span className="text-[#666666] flex-1 text-center flex items-center justify-center gap-2">
        {selectedProcess?.name ?? ""}
        {result?.auto_converted && (
          <span className="text-[#e8a838] bg-[#e8a838]/10 px-1.5 rounded text-[10px]">
            Auto-converted to grayscale
          </span>
        )}
      </span>
      <span className="text-[#666666] flex-1 text-right">
        PDI - UFPB
      </span>
    </div>
  );
}
