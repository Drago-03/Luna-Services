#!/bin/bash

# Python Dependencies Installation Script
# This script handles dependency conflicts gracefully

set -e

echo "🔧 Installing Python dependencies for Universal MCP System..."

# Function to install packages with error handling
install_package() {
    local package=$1
    echo "Installing $package..."
    if pip install "$package"; then
        echo "✅ Successfully installed $package"
    else
        echo "⚠️  Failed to install $package, skipping..."
    fi
}

# Core dependencies first
echo "📦 Installing core dependencies..."
pip install --upgrade pip

# Essential packages
pip install fastapi uvicorn pydantic sqlalchemy asyncpg alembic
pip install python-jose passlib python-multipart
pip install celery redis httpx aiohttp
pip install pytest black isort flake8
pip install structlog prometheus-client

# AI dependencies
echo "🤖 Installing AI dependencies..."
pip install google-generativeai
pip install langchain langchain-community langchain-core langchain-google-genai

# Install packages with flexible versions
echo "📚 Installing ML packages..."
install_package "torch>=2.2.0"
install_package "numpy>=1.24.0"
install_package "pillow>=10.0.0"
install_package "transformers>=4.30.0"
install_package "sentence-transformers>=2.0.0"

# Optional packages
echo "🔧 Installing optional packages..."
install_package "chromadb>=0.4.0"
install_package "faiss-cpu>=1.7.0"
install_package "opencv-python>=4.8.0"
install_package "librosa>=0.10.0"
install_package "soundfile>=0.12.0"

# Security and utilities
echo "🔐 Installing security and utility packages..."
install_package "cryptography>=42.0.0"
install_package "tiktoken"
install_package "openai"
install_package "anthropic"

# Development tools
echo "📝 Installing development tools..."
install_package "mkdocs"
install_package "mkdocs-material"
install_package "PyGithub"
install_package "slack-sdk"

echo "✅ Python dependencies installation completed!"
echo "ℹ️  Some optional packages may have been skipped due to compatibility issues."
echo "ℹ️  The core Universal MCP functionality will work without them."
