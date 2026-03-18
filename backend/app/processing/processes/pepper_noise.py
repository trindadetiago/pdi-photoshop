import numpy as np

from app.processing.registry import ProcessRegistry
from app.schemas import ParamDefinition, ProcessDefinition

definition = ProcessDefinition(
    id="pepper_noise",
    name="Pepper Noise",
    category="noise",
    applicable_to="both",
    params=[
        ParamDefinition(name="probability", label="Probability", type="float", default=0.05, min=0.001, max=0.5, step=0.001),
    ],
    output_type="single_image",
)


@ProcessRegistry.register(definition)
def process(image: np.ndarray, probability: float = 0.05, **kw) -> dict:
    result = image.copy()
    mask = np.random.random(image.shape[:2]) < probability
    if len(image.shape) == 3:
        result[mask] = [0, 0, 0]
    else:
        result[mask] = 0
    return {"images": [result], "histograms": None}
