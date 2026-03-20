import cv2
import numpy as np

from app.processing.registry import ProcessRegistry
from app.schemas import ParamDefinition, ProcessDefinition

definition = ProcessDefinition(
    id="adaptive_median_filter",
    name="Adaptive Median",
    category="spatial_filter",
    applicable_to="both",
    params=[
        ParamDefinition(name="max_window_size", label="Max Window Size", type="int", default=7, min=3, max=31, step=2),
    ],
    output_type="single_image",
)

def _adaptive_median_channel(channel: np.ndarray, max_size: int) -> np.ndarray:
    """Apply adaptive median filter to a single channel."""
    result = channel.copy()
    rows, cols = channel.shape
    max_size = max_size if max_size % 2 == 1 else max_size + 1

    padded = cv2.copyMakeBorder(channel, max_size // 2, max_size // 2,
                                 max_size // 2, max_size // 2, cv2.BORDER_REFLECT)

    for i in range(rows):
        for j in range(cols):
            win_size = 3
            pi, pj = i + max_size // 2, j + max_size // 2
            while win_size <= max_size:
                half = win_size // 2
                window = padded[pi - half:pi + half + 1, pj - half:pj + half + 1]
                z_min = int(window.min())
                z_max = int(window.max())
                z_med = int(np.median(window))
                z_xy = int(channel[i, j])

                if z_min < z_med < z_max:
                    if z_min < z_xy < z_max:
                        result[i, j] = z_xy
                    else:
                        result[i, j] = z_med
                    break
                else:
                    win_size += 2

            if win_size > max_size:
                result[i, j] = int(np.median(
                    padded[pi - max_size // 2:pi + max_size // 2 + 1,
                           pj - max_size // 2:pj + max_size // 2 + 1]
                ))

    return result


@ProcessRegistry.register(definition)
def process(image: np.ndarray, max_window_size: int = 7, **kw) -> dict:
    max_window_size = max_window_size if max_window_size % 2 == 1 else max_window_size + 1

    if len(image.shape) == 3:
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        h, s, v = cv2.split(hsv)
        v_result = _adaptive_median_channel(v, max_window_size)
        hsv_result = cv2.merge([h, s, v_result])
        result = cv2.cvtColor(hsv_result, cv2.COLOR_HSV2BGR)
    else:
        result = _adaptive_median_channel(image, max_window_size)

    return {"images": [result], "histograms": None}
