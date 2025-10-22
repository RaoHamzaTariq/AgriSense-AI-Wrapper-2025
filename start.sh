#!/bin/bash
echo "🚀 Starting FastAPI with Uvicorn..."
python3 -m uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}
