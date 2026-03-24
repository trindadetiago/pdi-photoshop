import cv2
import numpy as np

from app.processing.registry import ProcessRegistry
from app.schemas import ParamDefinition, ProcessDefinition

definition = ProcessDefinition(
    id="log_transform",
    name="Log Transform",
    category="intensity_transform",
    applicable_to="both",
    params=[
        ParamDefinition(
            name="c", label="Constant (c)", type="float",
            default=1.0, min=0.1, max=100.0, step=0.1,
        ),
    ],
    output_type="single_image",
)


@ProcessRegistry.register(definition)
def process(image: np.ndarray, c: float = 1.0, **kw) -> dict:
    img = image.astype(np.float64)
    result = c * np.log1p(img)
    result = np.clip(result, 0, 255).astype(np.uint8)
    return {"images": [result.astype(np.uint8)], "histograms": None}
