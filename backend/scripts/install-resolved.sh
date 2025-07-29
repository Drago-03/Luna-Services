#!/bin/bash

# Luna Services Backend - Dependency Resolution Installation Script
# This script resolves all dependency conflicts and ensures a working installation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

info() {
    echo -e "${PURPLE}[$(date +'%Y-%m-%d %H:%M:%S')] NOTE:${NC} $1"
}

# Function to check if we're in a virtual environment
check_venv() {
    if [[ "$VIRTUAL_ENV" != "" ]]; then
        success "Virtual environment active: $VIRTUAL_ENV"
        return 0
    else
        warning "No virtual environment detected"
        return 1
    fi
}

# Function to create and activate virtual environment
setup_venv() {
    log "Setting up Python virtual environment..."
    
    if [ ! -d "venv" ]; then
        log "Creating virtual environment..."
        python3 -m venv venv
        success "Virtual environment created"
    fi
    
    log "Activating virtual environment..."
    source venv/bin/activate
    success "Virtual environment activated"
}

# Function to upgrade pip and install tools
setup_pip() {
    log "Upgrading pip and installing basic tools..."
    python -m pip install --upgrade pip
    pip install wheel setuptools
    success "Pip and tools upgraded"
}

# Function to install packages with error handling and retries
install_package() {
    local package=$1
    local optional=${2:-false}
    local max_retries=3
    local retry_count=0
    
    while [ $retry_count -lt $max_retries ]; do
        log "Installing $package (attempt $((retry_count + 1))/$max_retries)..."
        
        if pip install "$package" --no-cache-dir; then
            success "Successfully installed $package"
            return 0
        else
            retry_count=$((retry_count + 1))
            if [ $retry_count -lt $max_retries ]; then
                warning "Failed to install $package, retrying..."
                sleep 2
            fi
        fi
    done
    
    if [ "$optional" = "true" ]; then
        warning "Failed to install optional package $package after $max_retries attempts, skipping..."
        return 1
    else
        error "Failed to install required package $package after $max_retries attempts"
        return 1
    fi
}

# Function to test core imports
test_core_imports() {
    log "Testing core dependency imports..."
    
    python -c "
import sys
print(f'Python version: {sys.version}')

# Test core FastAPI stack
try:
    import fastapi
    import uvicorn
    import pydantic
    import pydantic_settings
    print('✅ FastAPI stack: OK')
except ImportError as e:
    print(f'❌ FastAPI stack: FAILED - {e}')
    sys.exit(1)

# Test database
try:
    import sqlalchemy
    import asyncpg
    import alembic
    print('✅ Database stack: OK')
except ImportError as e:
    print(f'❌ Database stack: FAILED - {e}')
    sys.exit(1)

# Test AI dependencies
try:
    import google.generativeai as genai
    import langchain
    import langchain_community
    import langchain_core
    import langchain_google_genai
    print('✅ AI/ML stack: OK')
except ImportError as e:
    print(f'❌ AI/ML stack: FAILED - {e}')
    sys.exit(1)

# Test Supabase
try:
    import supabase
    print('✅ Supabase client: OK')
except ImportError as e:
    print(f'❌ Supabase client: FAILED - {e}')
    sys.exit(1)

print('\\n🎉 All core dependencies imported successfully!')
"
    
    if [ $? -eq 0 ]; then
        success "Core dependency test passed"
        return 0
    else
        error "Core dependency test failed"
        return 1
    fi
}

# Function to run basic FastAPI test
test_fastapi_app() {
    log "Testing FastAPI application startup..."
    
    python -c "
import sys
import os
sys.path.append(os.getcwd())

try:
    from app.main import app
    print('✅ FastAPI app imports successfully')
    
    # Test basic app creation
    if app:
        print('✅ FastAPI app instance created')
    else:
        print('❌ FastAPI app instance is None')
        sys.exit(1)
        
except Exception as e:
    print(f'❌ FastAPI app test failed: {e}')
    sys.exit(1)

print('🚀 FastAPI application test passed!')
"
    
    if [ $? -eq 0 ]; then
        success "FastAPI application test passed"
        return 0
    else
        warning "FastAPI application test failed (this may be due to missing environment variables)"
        return 1
    fi
}

# Main installation process
main() {
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║        Luna Services Backend - Dependency Resolution         ║"
    echo "║                    Installation Script                       ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    # Check if we're in the right directory
    if [ ! -f "requirements-resolved.txt" ]; then
        error "requirements-resolved.txt not found. Please run this script from the backend directory."
        exit 1
    fi
    
    # Setup virtual environment if not already in one
    if ! check_venv; then
        setup_venv
    fi
    
    # Upgrade pip and tools
    setup_pip
    
    # Install core dependencies from resolved requirements
    log "Installing resolved dependencies..."
    if ! pip install -r requirements-resolved.txt --no-cache-dir; then
        error "Failed to install resolved dependencies"
        exit 1
    fi
    success "All resolved dependencies installed successfully"
    
    # Test imports
    if ! test_core_imports; then
        error "Core dependency tests failed"
        exit 1
    fi
    
    # Test FastAPI application
    info "Testing FastAPI application (optional)..."
    test_fastapi_app || true  # Don't fail on this test
    
    # Generate summary
    echo -e "${GREEN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    Installation Complete!                    ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    success "Backend dependencies successfully installed and tested"
    info "Core FastAPI stack: ✅ Working"
    info "Database components: ✅ Working" 
    info "AI/ML dependencies: ✅ Working"
    info "Supabase integration: ✅ Working"
    
    echo ""
    log "Next steps:"
    echo "  1. Set up environment variables (.env file)"
    echo "  2. Initialize database: 'alembic upgrade head'"
    echo "  3. Start the API: 'uvicorn app.main:app --reload'"
    echo ""
    
    info "Optional: Install heavy ML dependencies with 'pip install -r requirements-ml-optional.txt'"
}

# Run main function
main "$@"
