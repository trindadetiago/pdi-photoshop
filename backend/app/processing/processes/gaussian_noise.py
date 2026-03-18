import numpy as np

from app.processing.registry import ProcessRegistry
from app.schemas import ParamDefinition, ProcessDefinition

definition = ProcessDefinition(
    id="gaussian_noise",
    name="Gaussian Noise",
    category="noise",
    applicable_to="both",
    params=[
        ParamDefinition(name="mean", label="Mean", type="float", default=0.0, min=0.0, max=100.0, step=0.1),
        ParamDefinition(name="stddev", label="Std Dev", type="float", default=25.0, min=0.1, max=100.0, step=0.1),
    ],
    output_type="single_image",
)


@ProcessRegistry.register(definition)
def process(image: np.ndarray, mean: float = 0.0, stddev: float = 25.0, **kw) -> dict:
    noise = np.random.normal(mean, stddev, image.shape)
    result = image.astype(np.float64) + noise
    result = np.clip(result, 0, 255).astype(np.uint8)
    return {"images": [result], "histograms": None}
