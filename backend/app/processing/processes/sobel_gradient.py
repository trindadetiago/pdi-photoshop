import cv2
import numpy as np

from app.processing.registry import ProcessRegistry
from app.schemas import ParamDefinition, ProcessDefinition

definition = ProcessDefinition(
    id="sobel_gradient",
    name="Sobel Gradient",
    category="spatial_filter",
    applicable_to="both",
    params=[
        ParamDefinition(name="kernel_size", label="Kernel Size", type="int", default=3, min=1, max=7, step=2),
    ],
    output_type="single_image",
)


@ProcessRegistry.register(definition)
def process(image: np.ndarray, kernel_size: int = 3, **kw) -> dict:
    kernel_size = kernel_size if kernel_size % 2 == 1 else kernel_size + 1
    
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image

    sobel_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=kernel_size)
    sobel_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=kernel_size)
    magnitude = np.sqrt(sobel_x**2 + sobel_y**2)
    result = cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)

    return {"images": [result], "histograms": None}