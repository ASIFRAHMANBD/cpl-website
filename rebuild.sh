#!/bin/bash
# Script to clean rebuild and restart the application

set -e

echo "🛑 Stopping containers..."
docker-compose down

echo "🧹 Cleaning up old images and containers..."
docker-compose rm -f
docker rmi asif449/cpl-website:9 || true

echo "🔨 Building fresh Docker image..."
docker build --no-cache -t asif449/cpl-website:9 .

echo "🚀 Starting containers..."
docker-compose up -d

echo "📊 Checking container status..."
docker-compose ps

echo "📝 Viewing logs (press Ctrl+C to exit)..."
docker-compose logs -f app


