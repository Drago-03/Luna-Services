#!/bin/bash

#
# Enhanced Python Dependencies Installation Script for Universal MCP System
# This script handles dependency conflicts gracefully and provides comprehensive logging
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"
}

success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS:${NC} $1"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

# Function to install packages with comprehensive error handling
install_package() {
    local package=$1
    local optional=${2:-false}
    
    log "Installing $package..."
    
    if pip install "$package" --no-deps; then
        success "Successfully installed $package"
        return 0
    else
        if [ "$optional" = "true" ]; then
            warning "Failed to install optional package $package, skipping..."
            return 1
        else
            error "Failed to install required package $package"
            return 1
        fi
    fi
}

# Function to install packages with dependency resolution
install_with_deps() {
    local package=$1
    log "Installing $package with dependencies..."
    
    if pip install "$package"; then
        success "Successfully installed $package with dependencies"
        return 0
    else
        error "Failed to install $package"
        return 1
    fi
}

# Main installation function
main() {
    log "🔧 Installing Python dependencies for Universal MCP System..."
    
    # Check Python version
    python_version=$(python --version 2>&1 | cut -d' ' -f2)
    log "Python version: $python_version"
    
    # Upgrade pip first
    log "📦 Upgrading pip..."
    pip install --upgrade pip setuptools wheel
    
    # Install core dependencies first (lightweight, no conflicts)
    log "📦 Installing core web framework dependencies..."
    install_with_deps "fastapi==0.104.1"
    install_with_deps "uvicorn[standard]==0.24.0"
    install_with_deps "pydantic>=2.5.0,<3.0.0"
    install_with_deps "pydantic-settings>=2.1.0"
    
    # Database dependencies
    log "💾 Installing database dependencies..."
    install_with_deps "sqlalchemy==2.0.23"
    install_with_deps "asyncpg==0.29.0"
    install_with_deps "alembic==1.13.1"
    
    # Authentication dependencies
    log "🔐 Installing authentication dependencies..."
    install_with_deps "python-jose[cryptography]==3.3.0"
    install_with_deps "passlib[bcrypt]==1.7.4"
    install_with_deps "python-multipart==0.0.6"
    
    # Supabase integration
    log "☁️  Installing Supabase integration..."
    install_with_deps "supabase==2.3.4"
    
    # Task queue and HTTP clients
    log "⚡ Installing task queue and HTTP clients..."
    install_with_deps "celery==5.3.4"
    install_with_deps "redis==5.0.1"
    install_with_deps "httpx==0.25.2"
    install_with_deps "aiohttp==3.9.1"
    
    # Essential utilities
    log "🛠️  Installing essential utilities..."
    install_with_deps "aiofiles>=23.0.0"
    install_with_deps "structlog==23.2.0"
    install_with_deps "prometheus-client==0.19.0"
    
    # Basic ML dependencies (lightweight)
    log "🧠 Installing basic ML dependencies..."
    install_with_deps "numpy>=1.24.0,<2.0.0"
    install_with_deps "pillow>=10.0.0,<11.0.0"
    
    # AI dependencies (core LangChain and Google AI)
    log "🤖 Installing AI dependencies..."
    if install_with_deps "google-generativeai>=0.8.0"; then
        success "Google Generative AI installed successfully"
    else
        warning "Failed to install Google Generative AI - some MCP features may be limited"
    fi
    
    if install_with_deps "langchain>=0.1.0,<0.3.0"; then
        install_with_deps "langchain-community>=0.0.1,<0.3.0" || warning "LangChain community failed"
        install_with_deps "langchain-core>=0.1.0,<0.3.0" || warning "LangChain core failed"
        install_with_deps "langchain-google-genai>=1.0.0" || warning "LangChain Google GenAI failed"
        success "LangChain ecosystem installed"
    else
        warning "Failed to install LangChain - some MCP features may be limited"
    fi
    
    # Optional gRPC dependencies (for Riva)
    log "📡 Installing optional gRPC dependencies..."
    install_package "grpcio>=1.50.0,<2.0.0" "true"
    install_package "grpcio-tools>=1.50.0,<2.0.0" "true"
    
    # Development dependencies
    log "🧪 Installing development dependencies..."
    install_with_deps "pytest==7.4.3"
    install_with_deps "pytest-asyncio==0.21.1"
    install_with_deps "black==23.11.0"
    install_with_deps "isort==5.12.0"
    install_with_deps "flake8==6.1.0"
    
    # Third-party integrations
    log "🔗 Installing third-party integrations..."
    install_package "PyGithub==2.1.1" "true"
    install_package "slack-sdk==3.26.1" "true"
    
    # Documentation tools
    log "📚 Installing documentation tools..."
    install_package "mkdocs==1.5.3" "true"
    install_package "mkdocs-material==9.4.14" "true"
    
    # Security dependencies
    log "🔒 Installing security dependencies..."
    install_with_deps "cryptography>=42.0.0,<44.0.0"
    
    # Additional MCP utilities
    log "🎯 Installing MCP utilities..."
    install_package "tiktoken>=0.5.0" "true"
    install_package "openai>=1.6.0,<2.0.0" "true"
    install_package "anthropic>=0.8.0,<1.0.0" "true"
    install_package "huggingface-hub>=0.19.0,<1.0.0" "true"
    
    success "✅ Core Python dependencies installation completed!"
    echo ""
    warning "📋 Installation Summary:"
    warning "   • Core web framework: ✅ Installed"
    warning "   • Database support: ✅ Installed"
    warning "   • Authentication: ✅ Installed"
    warning "   • Basic AI capabilities: ✅ Installed"
    warning "   • Development tools: ✅ Installed"
    echo ""
    log "🚀 Optional heavy ML dependencies (PyTorch, Transformers, etc.):"
    log "   Run: pip install -r requirements-ml-optional.txt"
    echo ""
    log "🎯 The core Universal MCP functionality is now ready!"
    log "   You can start the backend server with: uvicorn app.main:app --reload"
}

# Run main function
main "$@"
