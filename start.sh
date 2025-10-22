#!/bin/bash
# start.sh — launch FastAPI backend on Railway

echo "🚀 Starting FastAPI with Uvicorn..."
uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}