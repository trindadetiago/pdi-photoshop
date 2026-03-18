from __future__ import annotations

from pydantic import BaseModel
from typing import Literal, Optional


class ParamDefinition(BaseModel):
    name: str
    label: str
    type: Literal["int", "float", "bool", "select"]
    default: float | int | bool | str | None = None
    min: float | int | None = None
    max: float | int | None = None
    step: float | int | None = None
    options: list[str] | None = None
    description: str | None = None


class ProcessDefinition(BaseModel):
    id: str
    name: str
    category: str
    applicable_to: Literal["grayscale", "color", "both"]
    params: list[ParamDefinition] = []
    output_type: Literal["single_image", "multiple_images", "image_with_histograms"]
    output_labels: list[str] | None = None


class ImageData(BaseModel):
    label: str
    data: str  # base64


class HistogramData(BaseModel):
    before: list[int]
    after: list[int]


class ProcessResult(BaseModel):
    process_id: str
    output_type: Literal["single_image", "multiple_images", "image_with_histograms"]
    images: list[ImageData]
    histograms: HistogramData | None = None
    auto_converted: bool = False
