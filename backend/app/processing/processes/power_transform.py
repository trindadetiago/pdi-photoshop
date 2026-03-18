import cv2
import numpy as np

from app.processing.registry import ProcessRegistry
from app.schemas import ParamDefinition, ProcessDefinition

definition = ProcessDefinition(
    id="power_transform",
    name="Power Transform",
    category="intensity_transform",
    applicable_to="both",
    params=[
        ParamDefinition(
            name="c", label="Constant (c)", type="float",
            default=1.0, min=0.1, max=100.0, step=0.1,
        ),
        ParamDefinition(
            name="gamma", label="Gamma", type="float",
            default=1.0, min=0.01, max=10.0, step=0.01,
        ),
    ],
    output_type="single_image",
)


@ProcessRegistry.register(definition)
def process(image: np.ndarray, c: float = 1.0, gamma: float = 1.0, **kw) -> dict:
    normalized = image.astype(np.float64) / 255.0
    result = c * np.power(normalized, gamma)
    result = np.clip(result * 255, 0, 255).astype(np.uint8)
    return {"images": [result], "histograms": None}
