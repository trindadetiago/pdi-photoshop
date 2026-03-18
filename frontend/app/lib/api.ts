import { ProcessDefinition, ProcessResult } from "../types/process";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchProcesses(): Promise<ProcessDefinition[]> {
  const res = await fetch(`${API}/api/processes`);
  if (!res.ok) throw new Error("Failed to fetch processes");
  return res.json();
}

export async function applyProcess(
  file: File,
  processId: string,
  params: Record<string, unknown>,
  signal?: AbortSignal
): Promise<ProcessResult> {
  const form = new FormData();
  form.append("image", file);
  form.append("process_id", processId);
  form.append("params", JSON.stringify(params));

  const res = await fetch(`${API}/api/process`, {
    method: "POST",
    body: form,
    signal,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || "Processing failed");
  }
  return res.json();
}
