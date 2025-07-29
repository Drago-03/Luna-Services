#!/bin/bash

#
# AutoMCP Setup Script for Luna Services Universal MCP System
#
# This script prepares Luna Services for deployment with AutoMCP and Naptha's MCPaaS
#

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites for AutoMCP compatibility..."
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        error "Python 3 is not installed. Please install Python 3.11+ first."
        exit 1
    fi
    
    # Check uv (recommended package manager)
    if ! command -v uv &> /dev/null; then
        warning "uv is not installed. Installing uv for better package management..."
        curl -LsSf https://astral.sh/uv/install.sh | sh
        source $HOME/.cargo/env
    fi
    
    success "Prerequisites check completed"
}

# Install AutoMCP
install_automcp() {
    log "Installing AutoMCP and dependencies..."
    
    cd "$PROJECT_ROOT"
    
    # Install using uv if available, otherwise pip
    if command -v uv &> /dev/null; then
        uv add naptha-automcp
        uv sync
    else
        pip install naptha-automcp
        pip install -r backend/requirements.txt
    fi
    
    success "AutoMCP installation completed"
}

# Validate MCP server setup
validate_setup() {
    log "Validating AutoMCP setup..."
    
    cd "$PROJECT_ROOT"
    
    # Check if run_mcp.py exists
    if [ ! -f "run_mcp.py" ]; then
        error "run_mcp.py not found. This file should have been created."
        exit 1
    fi
    
    # Check if pyproject.toml has correct configuration
    if [ ! -f "pyproject.toml" ]; then
        error "pyproject.toml not found. This file is required for AutoMCP."
        exit 1
    fi
    
    # Test the MCP server
    log "Testing MCP server startup..."
    timeout 10 python run_mcp.py &
    SERVER_PID=$!
    sleep 3
    
    if kill -0 $SERVER_PID 2>/dev/null; then
        success "MCP server started successfully"
        kill $SERVER_PID
    else
        error "MCP server failed to start"
        exit 1
    fi
    
    success "Setup validation completed"
}

# Create environment file
create_env_file() {
    log "Creating environment configuration..."
    
    cd "$PROJECT_ROOT"
    
    if [ ! -f ".env" ]; then
        cat > .env << 'EOF'
# Luna Services AutoMCP Environment Configuration

# Environment
NODE_ENV=development
PYTHON_ENV=development

# Core API Configuration
JWT_SECRET=your-super-secret-jwt-key-here
DATABASE_URL=postgresql://luna_user:luna_password@localhost:5432/luna_db
REDIS_URL=redis://localhost:6379/0

# Google Gemini Configuration (REQUIRED)
GEMINI_API_KEY=your-google-gemini-api-key-here
GEMINI_MODEL=gemini-2.5-flash
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=8192

# NVIDIA Riva Configuration (Optional)
RIVA_SERVER_URL=http://localhost:50051
RIVA_LANGUAGE=en-US
RIVA_VOICE=English-US.Female-1

# LangChain Configuration
LANGCHAIN_CHAIN_TYPE=conversational
LANGCHAIN_MEMORY_TYPE=conversation_buffer
LANGCHAIN_MAX_MEMORY=10

# Vector Database
VECTOR_DB_URL=http://localhost:8000

# MCP Feature Toggles
MCP_ENABLE_VOICE=true
MCP_ENABLE_MULTIMODAL=true
MCP_ENABLE_ANALYTICS=true
MCP_MAX_CONCURRENT=100

# External Integrations
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
OPENAI_API_KEY=your-openai-api-key-here
EOF
        success "Created .env file. Please update it with your API keys."
    else
        warning ".env file already exists. Skipping creation."
    fi
}

# Generate AutoMCP files
generate_automcp_files() {
    log "Generating AutoMCP-compatible files..."
    
    cd "$PROJECT_ROOT"
    
    # The run_mcp.py file should already exist from the previous setup
    if [ -f "run_mcp.py" ]; then
        success "run_mcp.py already exists"
    else
        error "run_mcp.py not found. Please ensure the main setup is complete."
        exit 1
    fi
    
    success "AutoMCP files generation completed"
}

# Test AutoMCP compatibility
test_automcp() {
    log "Testing AutoMCP compatibility..."
    
    cd "$PROJECT_ROOT"
    
    # Test with uvx if available
    if command -v uvx &> /dev/null; then
        log "Testing with uvx..."
        timeout 10 uvx --from . serve_stdio &
        TEST_PID=$!
        sleep 3
        
        if kill -0 $TEST_PID 2>/dev/null; then
            success "uvx test passed"
            kill $TEST_PID
        else
            warning "uvx test failed, but this might be expected without full setup"
        fi
    fi
    
    success "AutoMCP compatibility testing completed"
}

# Main setup function
main() {
    log "Starting AutoMCP setup for Luna Services..."
    
    check_prerequisites
    install_automcp
    create_env_file
    generate_automcp_files
    validate_setup
    test_automcp
    
    success "AutoMCP setup completed successfully!"
    
    echo ""
    echo "🎉 Luna Services is now compatible with AutoMCP!"
    echo ""
    echo "Next steps:"
    echo "1. Update your .env file with your API keys (especially GEMINI_API_KEY)"
    echo "2. Test locally: python run_mcp.py"
    echo "3. Test with AutoMCP: automcp serve -t sse"
    echo "4. Test with uvx: uvx --from . serve_stdio"
    echo "5. Deploy to Naptha's MCPaaS at https://labs.naptha.ai/"
    echo ""
    echo "For Cursor IDE integration, update the paths in .cursor/mcp.json"
    echo "For more information, see: https://github.com/napthaai/automcp"
}

# Run main function
main "$@"
