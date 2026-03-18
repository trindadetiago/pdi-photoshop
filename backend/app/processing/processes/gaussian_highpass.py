import cv2
import numpy as np

from app.processing.registry import ProcessRegistry
from app.schemas import ParamDefinition, ProcessDefinition

definition = ProcessDefinition(
    id="gaussian_highpass",
    name="Gaussian High-Pass",
    category="frequency_filter",
    applicable_to="both",
    params=[
        ParamDefinition(name="cutoff_frequency", label="Cutoff Frequency", type="float", default=30.0, min=1.0, max=500.0, step=1.0),
    ],
    output_type="single_image",
)


@ProcessRegistry.register(definition)
def process(image: np.ndarray, cutoff_frequency: float = 30.0, **kw) -> dict:
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image

    rows, cols = gray.shape
    crow, ccol = rows // 2, cols // 2

    dft = np.fft.fft2(gray.astype(np.float64))
    dft_shift = np.fft.fftshift(dft)

    u = np.arange(rows).reshape(-1, 1) - crow
    v = np.arange(cols).reshape(1, -1) - ccol
    d = np.sqrt(u**2 + v**2)

    h = 1.0 - np.exp(-(d**2) / (2 * cutoff_frequency**2))

    filtered = dft_shift * h
    result = np.fft.ifft2(np.fft.ifftshift(filtered))
    result = np.abs(result)
    result = cv2.normalize(result, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)

    return {"images": [result], "histograms": None}
