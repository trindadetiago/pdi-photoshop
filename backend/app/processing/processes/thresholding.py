import cv2
import numpy as np

from app.processing.registry import ProcessRegistry
from app.schemas import ParamDefinition, ProcessDefinition

definition = ProcessDefinition(
    id="thresholding",
    name="Thresholding",
    category="intensity_transform",
    applicable_to="both",
    params=[
        ParamDefinition(
            name="k", label="Threshold (k)", type="int",
            default=128, min=0, max=255, step=1,
        ),
    ],
    output_type="single_image",
)


@ProcessRegistry.register(definition)
def process(image: np.ndarray, k: int = 128, **kw) -> dict:
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image
    _, result = cv2.threshold(gray, k, 255, cv2.THRESH_BINARY)
    return {"images": [result], "histograms": None}
