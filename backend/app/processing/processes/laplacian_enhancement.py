import cv2
import numpy as np

from app.processing.registry import ProcessRegistry
from app.schemas import ParamDefinition, ProcessDefinition

definition = ProcessDefinition(
    id="laplacian_enhancement",
    name="Laplacian Enhancement",
    category="spatial_filter",
    applicable_to="both",
    params=[
        ParamDefinition(name="kernel_size", label="Kernel Size", type="int", default=3, min=1, max=7, step=2),
    ],
    output_type="multiple_images",
    output_labels=["Enhanced", "Laplacian"],
)


@ProcessRegistry.register(definition)
def process(image: np.ndarray, kernel_size: int = 3, **kw) -> dict:
    kernel_size = kernel_size if kernel_size % 2 == 1 else kernel_size + 1

    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image

    laplacian = cv2.Laplacian(gray, cv2.CV_64F, ksize=kernel_size)
    laplacian_display = cv2.normalize(np.abs(laplacian), None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)

    enhanced = gray.astype(np.float64) - laplacian
    enhanced = np.clip(enhanced, 0, 255).astype(np.uint8)

    return {"images": [enhanced, laplacian_display], "histograms": None}