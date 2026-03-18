"use client";

import { useState } from "react";
import { useImageProcessor } from "./hooks/useImageProcessor";
import TopToolbar from "./components/TopToolbar";
import IconStrip from "./components/IconStrip";
import ProcessPanel from "./components/ProcessPanel";
import Canvas from "./components/Canvas";
import PropertiesPanel from "./components/PropertiesPanel";
import StatusBar from "./components/StatusBar";

export default function Home() {
  const {
    catalog,
    loading,
    error,
    file,
    preview,
    imageType,
    imageDimensions,
    selectedProcess,
    params,
    result,
    processing,
    handleImage,
    selectProcess,
    updateParam,
    setError,
  } = useImageProcessor();

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="h-screen bg-[#1a1a1a] flex items-center justify-center text-[#666666]">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col text-[#e0e0e0]">
      <TopToolbar
        file={file}
        imageType={imageType}
        imageDimensions={imageDimensions}
        result={result}
      />

      <div className="flex flex-1 overflow-hidden">
        <IconStrip
          activeCategory={activeCategory}
          onCategorySelect={setActiveCategory}
          onImage={handleImage}
          hasImage={!!preview}
        />

        {activeCategory && (
          <ProcessPanel
            category={activeCategory}
            catalog={catalog}
            imageType={imageType}
            selectedProcess={selectedProcess}
            onSelect={selectProcess}
          />
        )}

        <Canvas
          preview={preview}
          result={result}
          processing={processing}
          error={error}
          onImage={handleImage}
          onClearError={() => setError(null)}
        />

        {(selectedProcess || result?.histograms) && (
          <PropertiesPanel
            params={selectedProcess?.params ?? []}
            values={params}
            onChange={updateParam}
            histograms={result?.histograms ?? null}
          />
        )}
      </div>

      <StatusBar
        processing={processing}
        selectedProcess={selectedProcess}
        error={error}
        result={result}
      />
    </div>
  );
}
