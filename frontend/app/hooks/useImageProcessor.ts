"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { fetchProcesses, applyProcess } from "../lib/api";
import { detectImageType } from "../lib/detectImageType";
import {
  ProcessDefinition,
  ProcessResult,
  ImageType,
} from "../types/process";

export function useImageProcessor() {
  const [catalog, setCatalog] = useState<ProcessDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageType, setImageType] = useState<ImageType | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const [selectedProcess, setSelectedProcess] =
    useState<ProcessDefinition | null>(null);
  const [params, setParams] = useState<Record<string, unknown>>({});

  const [result, setResult] = useState<ProcessResult | null>(null);
  const [processing, setProcessing] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchProcesses()
      .then(setCatalog)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleImage = useCallback(async (f: File) => {
    setFile(f);
    setResult(null);
    setSelectedProcess(null);
    setParams({});

    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(f);
    });

    setPreview(dataUrl);

    const img = new Image();
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
    img.src = dataUrl;

    const type = await detectImageType(dataUrl);
    setImageType(type);
  }, []);

  const selectProcess = useCallback(
    (p: ProcessDefinition | null) => {
      setSelectedProcess(p);
      setResult(null);
      if (p) {
        const defaults: Record<string, unknown> = {};
        for (const param of p.params) {
          defaults[param.name] = param.default ?? null;
        }
        setParams(defaults);
      } else {
        setParams({});
      }
    },
    []
  );

  const updateParam = useCallback((name: string, value: unknown) => {
    setParams((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Auto-apply with debounce
  useEffect(() => {
    if (!file || !selectedProcess) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    debounceRef.current = setTimeout(() => {
      const controller = new AbortController();
      abortRef.current = controller;

      setProcessing(true);
      setError(null);

      applyProcess(file, selectedProcess.id, params, controller.signal)
        .then((res) => {
          if (!controller.signal.aborted) {
            setResult(res);
          }
        })
        .catch((e: unknown) => {
          if (e instanceof DOMException && e.name === "AbortError") return;
          if (!controller.signal.aborted) {
            setError(e instanceof Error ? e.message : "Processing failed");
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setProcessing(false);
          }
        });
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [file, selectedProcess, params]);

  return {
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
  };
}
