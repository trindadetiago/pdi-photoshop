import cv2
import numpy as np

from app.processing.registry import ProcessRegistry
from app.schemas import ParamDefinition, ProcessDefinition

definition = ProcessDefinition(
    id="min_filter",
    name="Min Filter",
    category="spatial_filter",
    applicable_to="both",
    params=[
        ParamDefinition(name="kernel_size", label="Kernel Size", type="int", default=3, min=3, max=31, step=2),
    ],
    output_type="single_image",
)


@ProcessRegistry.register(definition)
def process(image: np.ndarray, kernel_size: int = 3, **kw) -> dict:
    kernel_size = kernel_size if kernel_size % 2 == 1 else kernel_size + 1

    if len(image.shape) == 3:
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        h, s, v = cv2.split(hsv)
        v_result = cv2.medianBlur(v, kernel_size)
        hsv_result = cv2.merge([h, s, v_result])
        result = cv2.cvtColor(hsv_result, cv2.COLOR_HSV2BGR)
    else:
        result = cv2.medianBlur(image, kernel_size)

    return {"images": [result], "histograms": None}
