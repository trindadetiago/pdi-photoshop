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
    # Ensure kernel_size is odd
    kernel_size = kernel_size if kernel_size % 2 == 1 else kernel_size + 1
    result = cv2.GaussianBlur(image, (kernel_size, kernel_size), sigma)
    return {"images": [result], "histograms": None}
