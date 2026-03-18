import cv2
import numpy as np

from app.processing.registry import ProcessRegistry
from app.schemas import ProcessDefinition

definition = ProcessDefinition(
    id="laplacian_enhancement",
    name="Laplacian Enhancement",
    category="spatial_filter",
    applicable_to="both",
    params=[],
    output_type="multiple_images",
    output_labels=["Enhanced", "Laplacian"],
)


@ProcessRegistry.register(definition)
def process(image: np.ndarray, **kw) -> dict:
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image

    laplacian = cv2.Laplacian(gray, cv2.CV_64F)
    laplacian_display = cv2.normalize(np.abs(laplacian), None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)

    enhanced = gray.astype(np.float64) - laplacian
    enhanced = np.clip(enhanced, 0, 255).astype(np.uint8)

    return {"images": [enhanced, laplacian_display], "histograms": None}
