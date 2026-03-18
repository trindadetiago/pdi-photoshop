# PDI - Processamento Digital de Imagens

Image processing application built for UFPB's Digital Image Processing course.

## Stack

- **Backend**: Python + FastAPI + OpenCV/NumPy
- **Frontend**: Next.js + React + Tailwind CSS

## Quick Start

```bash
./start.sh
```

Backend runs on `http://localhost:8888`, frontend on `http://localhost:3333`.

### Manual Start

```bash
# Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --port 8888 --reload

# Frontend
cd frontend
npm install
npm run dev -- --port 3333
```

## Features

- 23 image processing filters across 5 categories (spatial, frequency, intensity transforms, noise, decomposition)
- Auto-apply with 500ms debounce
- Comparison slider for before/after
- Grid view for multi-output processes (RGB/HSV decomposition)
- Histogram visualization
- Auto grayscale conversion for grayscale-only filters
- Large image downscaling for performance

## Adding a Process

Create a new file in `backend/app/processing/processes/`:

```python
import numpy as np
from app.processing.registry import ProcessRegistry
from app.schemas import ParamDefinition, ProcessDefinition

definition = ProcessDefinition(
    id="my_filter",
    name="My Filter",
    category="spatial_filter",
    applicable_to="both",
    params=[
        ParamDefinition(name="strength", label="Strength", type="float",
                        default=1.0, min=0.1, max=10.0, step=0.1),
    ],
    output_type="single_image",
)

@ProcessRegistry.register(definition)
def process(image: np.ndarray, strength: float = 1.0, **kw) -> dict:
    result = image  # your processing here
    return {"images": [result], "histograms": None}
```

No other files need to be modified — the process is auto-discovered at startup.
