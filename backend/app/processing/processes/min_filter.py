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
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (kernel_size, kernel_size))
    result = cv2.erode(image, kernel)
    return {"images": [result], "histograms": None}
