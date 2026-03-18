import cv2
import numpy as np

from app.processing.registry import ProcessRegistry
from app.schemas import ProcessDefinition

definition = ProcessDefinition(
    id="hsv_decomposition",
    name="HSV Decomposition",
    category="decomposition",
    applicable_to="color",
    params=[],
    output_type="multiple_images",
    output_labels=["H Channel", "S Channel", "V Channel"],
)


@ProcessRegistry.register(definition)
def process(image: np.ndarray, **kw) -> dict:
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    h, s, v = hsv[:, :, 0], hsv[:, :, 1], hsv[:, :, 2]
    return {"images": [h, s, v], "histograms": None}
