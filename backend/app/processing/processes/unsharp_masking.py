import cv2
import numpy as np

from app.processing.registry import ProcessRegistry
from app.schemas import ParamDefinition, ProcessDefinition

definition = ProcessDefinition(
    id="unsharp_masking",
    name="Unsharp Masking",
    category="spatial_filter",
    applicable_to="both",
    params=[
        ParamDefinition(name="gain", label="Gain", type="float", default=1.5, min=0.1, max=10.0, step=0.1),
        ParamDefinition(name="kernel_size", label="Kernel Size", type="int", default=5, min=3, max=31, step=2),
    ],
    output_type="single_image",
)


@ProcessRegistry.register(definition)
def process(image: np.ndarray, gain: float = 1.5, kernel_size: int = 5, **kw) -> dict:
    kernel_size = kernel_size if kernel_size % 2 == 1 else kernel_size + 1

    if len(image.shape) == 3:
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        h, s, v = cv2.split(hsv)
        blurred = cv2.GaussianBlur(v, (kernel_size, kernel_size), 0)
        mask = v.astype(np.float64) - blurred.astype(np.float64)
        v_result = v.astype(np.float64) + gain * mask
        v_result = np.clip(v_result, 0, 255).astype(np.uint8)
        hsv_result = cv2.merge([h, s, v_result])
        result = cv2.cvtColor(hsv_result, cv2.COLOR_HSV2BGR)
    else:
        blurred = cv2.GaussianBlur(image, (kernel_size, kernel_size), 0)
        mask = image.astype(np.float64) - blurred.astype(np.float64)
        result = image.astype(np.float64) + gain * mask
        result = np.clip(result, 0, 255).astype(np.uint8)

    return {"images": [result], "histograms": None}