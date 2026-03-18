import base64
import json
import logging
import time

import cv2
import numpy as np
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.processing import discover_processes
from app.processing.registry import ProcessRegistry
from app.schemas import HistogramData, ImageData, ProcessResult

logger = logging.getLogger("pdi")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

app = FastAPI(title="PDI - Processamento Digital de Imagens")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3333"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    discover_processes()
    count = len(ProcessRegistry.get_all_definitions())
    logger.info(f"Discovered {count} processes")


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/processes")
def list_processes():
    defs = ProcessRegistry.get_all_definitions()
    logger.info(f"Listed {len(defs)} processes")
    return defs


def encode_image(img: np.ndarray) -> str:
    """Encode a numpy image array to base64 PNG string."""
    success, buf = cv2.imencode(".png", img)
    if not success:
        raise ValueError("Failed to encode image")
    return base64.b64encode(buf.tobytes()).decode("utf-8")


@app.post("/api/process", response_model=ProcessResult)
async def process_image(
    image: UploadFile = File(...),
    process_id: str = Form(...),
    params: str = Form("{}"),
):
    logger.info(f"Process request: {process_id} | file={image.filename}")

    definition = ProcessRegistry.get_definition(process_id)
    if definition is None:
        logger.warning(f"Process not found: {process_id}")
        raise HTTPException(404, f"Process '{process_id}' not found")

    func = ProcessRegistry.get_function(process_id)

    try:
        parsed_params = json.loads(params)
    except json.JSONDecodeError:
        logger.error(f"Invalid params JSON: {params}")
        raise HTTPException(400, "Invalid params JSON")

    logger.info(f"Params: {parsed_params}")

    contents = await image.read()
    np_buf = np.frombuffer(contents, dtype=np.uint8)
    img = cv2.imdecode(np_buf, cv2.IMREAD_UNCHANGED)
    if img is None:
        logger.error("Failed to decode uploaded image")
        raise HTTPException(400, "Could not decode image")

    is_color = len(img.shape) == 3 and img.shape[2] >= 3
    logger.info(f"Image: {img.shape} | {'color' if is_color else 'grayscale'}")

    # Downscale large images to keep processing responsive
    MAX_DIM = 1024
    h, w = img.shape[:2]
    if max(h, w) > MAX_DIM:
        scale = MAX_DIM / max(h, w)
        new_w, new_h = int(w * scale), int(h * scale)
        img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
        logger.info(f"Downscaled to {img.shape} (max dim {MAX_DIM})")

    t0 = time.perf_counter()
    try:
        result = func(img, **parsed_params)
    except Exception as e:
        logger.error(f"Processing error in {process_id}: {e}", exc_info=True)
        raise HTTPException(422, f"Processing error: {e}")
    elapsed = (time.perf_counter() - t0) * 1000
    logger.info(f"Processed {process_id} in {elapsed:.1f}ms | {len(result['images'])} output(s)")

    # Detect if the process auto-converted color to grayscale
    first_out = result["images"][0] if result["images"] else None
    auto_converted = is_color and first_out is not None and len(first_out.shape) == 2
    if auto_converted:
        logger.info(f"Auto-converted color to grayscale for {process_id}")

    images_out = []
    labels = definition.output_labels or []
    for i, arr in enumerate(result["images"]):
        label = labels[i] if i < len(labels) else f"Result {i + 1}"
        images_out.append(ImageData(label=label, data=encode_image(arr)))

    histograms = None
    if result.get("histograms") is not None:
        h = result["histograms"]
        histograms = HistogramData(before=h["before"], after=h["after"])

    return ProcessResult(
        process_id=process_id,
        output_type=definition.output_type,
        images=images_out,
        histograms=histograms,
        auto_converted=auto_converted,
    )
