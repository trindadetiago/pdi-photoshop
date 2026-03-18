import cv2
import numpy as np

from app.processing.registry import ProcessRegistry
from app.schemas import ProcessDefinition

definition = ProcessDefinition(
    id="sobel_gradient",
    name="Sobel Gradient",
    category="spatial_filter",
    applicable_to="both",
    params=[],
    output_type="single_image",
)


@ProcessRegistry.register(definition)
def process(image: np.ndarray, **kw) -> dict:
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image

    sobel_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
    sobel_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
    magnitude = np.sqrt(sobel_x**2 + sobel_y**2)
    result = cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)

    return {"images": [result], "histograms": None}
