import cv2
import numpy as np

from app.processing.registry import ProcessRegistry
from app.schemas import ParamDefinition, ProcessDefinition

definition = ProcessDefinition(
    id="gaussian_mean_filter",
    name="Gaussian Mean Filter",
    category="spatial_filter",
    applicable_to="both",
    params=[
        ParamDefinition(name="sigma", label="Sigma", type="float", default=1.0, min=0.1, max=20.0, step=0.1),
        ParamDefinition(name="kernel_size", label="Kernel Size", type="int", default=3, min=3, max=31, step=2),
    ],
    output_type="single_image",
)


@ProcessRegistry.register(definition)
def process(image: np.ndarray, sigma: float = 1.0, kernel_size: int = 3, **kw) -> dict:
    kernel_size = kernel_size if kernel_size % 2 == 1 else kernel_size + 1

    if len(image.shape) == 3:
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        h, s, v = cv2.split(hsv)
        v_result = cv2.GaussianBlur(v, (kernel_size, kernel_size), sigma)
        hsv_result = cv2.merge([h, s, v_result])
        result = cv2.cvtColor(hsv_result, cv2.COLOR_HSV2BGR)
    else:
        result = cv2.GaussianBlur(image, (kernel_size, kernel_size), sigma)

    return {"images": [result], "histograms": None}
