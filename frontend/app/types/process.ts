export interface ParamDefinition {
  name: string;
  label: string;
  type: "int" | "float" | "bool" | "select";
  default?: number | boolean | string | null;
  min?: number | null;
  max?: number | null;
  step?: number | null;
  options?: string[] | null;
  description?: string | null;
}

export interface ProcessDefinition {
  id: string;
  name: string;
  category: string;
  applicable_to: "grayscale" | "color" | "both";
  params: ParamDefinition[];
  output_type: "single_image" | "multiple_images" | "image_with_histograms";
  output_labels?: string[] | null;
}

export interface ImageData {
  label: string;
  data: string; // base64
}

export interface HistogramData {
  before: number[];
  after: number[];
}

export interface ProcessResult {
  process_id: string;
  output_type: "single_image" | "multiple_images" | "image_with_histograms";
  images: ImageData[];
  histograms: HistogramData | null;
  auto_converted?: boolean;
}

export type ImageType = "grayscale" | "color";

export const CATEGORY_LABELS: Record<string, string> = {
  decomposition: "Decomposition",
  intensity_transform: "Intensity Transforms",
  spatial_filter: "Spatial Filters",
  frequency_filter: "Frequency Filters",
  noise: "Noise",
};

export const CATEGORY_ORDER = [
  "decomposition",
  "intensity_transform",
  "spatial_filter",
  "frequency_filter",
  "noise",
] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  decomposition: "Palette",
  intensity_transform: "SunMedium",
  spatial_filter: "Grid3X3",
  frequency_filter: "Waves",
  noise: "Zap",
};
