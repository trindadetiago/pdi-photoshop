#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"

cleanup() {
  echo "Shutting down..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
  echo "Done."
}
trap cleanup EXIT INT TERM

# Backend (port 8888)
echo "Starting backend on :8888..."
cd "$DIR/backend"
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8888 --reload &
BACKEND_PID=$!

# Frontend (port 3333)
echo "Starting frontend on :3333..."
cd "$DIR/frontend"
npx next dev --port 3333 &
FRONTEND_PID=$!

echo ""
echo "Backend:  http://localhost:8888"
echo "Frontend: http://localhost:3333"
echo "Press Ctrl+C to stop."
echo ""

wait
