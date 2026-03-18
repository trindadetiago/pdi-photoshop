import cv2
import numpy as np

from app.processing.registry import ProcessRegistry
from app.schemas import ParamDefinition, ProcessDefinition

definition = ProcessDefinition(
    id="intensity_slicing",
    name="Intensity Slicing",
    category="intensity_transform",
    applicable_to="both",
    params=[
        ParamDefinition(name="a", label="Lower bound (a)", type="int", default=100, min=0, max=255, step=1),
        ParamDefinition(name="b", label="Upper bound (b)", type="int", default=200, min=0, max=255, step=1),
        ParamDefinition(name="preserve_background", label="Preserve Background", type="bool", default=False),
    ],
    output_type="single_image",
)


@ProcessRegistry.register(definition)
def process(image: np.ndarray, a: int = 100, b: int = 200, preserve_background: bool = False, **kw) -> dict:
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image.copy()

    mask = (gray >= a) & (gray <= b)

    if preserve_background:
        result = gray.copy()
        result[mask] = 255
    else:
        result = np.zeros_like(gray)
        result[mask] = 255

    return {"images": [result], "histograms": None}
