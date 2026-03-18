import numpy as np

from app.processing.registry import ProcessRegistry
from app.schemas import ProcessDefinition

definition = ProcessDefinition(
    id="rgb_decomposition",
    name="RGB Decomposition",
    category="decomposition",
    applicable_to="color",
    params=[],
    output_type="multiple_images",
    output_labels=["R Channel", "G Channel", "B Channel"],
)


@ProcessRegistry.register(definition)
def process(image: np.ndarray, **kw) -> dict:
    # OpenCV uses BGR order
    b, g, r = image[:, :, 0], image[:, :, 1], image[:, :, 2]
    return {"images": [r, g, b], "histograms": None}
