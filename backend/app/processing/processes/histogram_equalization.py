import cv2
import numpy as np

from app.processing.registry import ProcessRegistry
from app.schemas import ProcessDefinition

definition = ProcessDefinition(
    id="histogram_equalization",
    name="Histogram Equalization",
    category="intensity_transform",
    applicable_to="both",
    params=[],
    output_type="image_with_histograms",
)


@ProcessRegistry.register(definition)
def process(image: np.ndarray, **kw) -> dict:
    if len(image.shape) == 3:
        raise ValueError("Equalização de histogramas só são suportadas para imagens na escala de cinza.")
    else:
        gray = image

    hist_before = cv2.calcHist([gray], [0], None, [256], [0, 256]).flatten().astype(int).tolist()

    result = cv2.equalizeHist(gray)

    hist_after = cv2.calcHist([result], [0], None, [256], [0, 256]).flatten().astype(int).tolist()

    return {
        "images": [result],
        "histograms": {"before": hist_before, "after": hist_after},
    }
