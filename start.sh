#!/bin/bash

#
# Luna-Services Universal MCP System - Development Startup Script
# 
# This script starts both the backend FastAPI server and frontend React/Vite dev server
# simultaneously for local development. It handles dependency installation, environment
# validation, and provides proper error handling and logging.
#
# Usage: ./start.sh [options]
# Options:
#   --frontend-only    Start only the frontend development server
#   --backend-only     Start only the backend FastAPI server
#   --production      Start in production mode (build and serve)
#   --docker          Use Docker Compose instead of local servers
#   --install-deps    Force reinstall all dependencies
#   --help            Show this help message
#
# Author: Luna-Services Team
# Updated: $(date +"%Y-%m-%d")
#

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"
BACKEND_DIR="$PROJECT_ROOT/backend"
LOG_DIR="$PROJECT_ROOT/logs"
PID_FILE="$PROJECT_ROOT/.server_pids"

# Default configuration
FRONTEND_ONLY=false
BACKEND_ONLY=false
PRODUCTION_MODE=false
DOCKER_MODE=false
INSTALL_DEPS=false
FORCE_KILL=false

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
    echo -e "${CYAN}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"
}

# Create log directory
create_log_dir() {
    if [ ! -d "$LOG_DIR" ]; then
        mkdir -p "$LOG_DIR"
        log "Created log directory: $LOG_DIR"
    fi
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --frontend-only)
                FRONTEND_ONLY=true
                shift
                ;;
            --backend-only)
                BACKEND_ONLY=true
                shift
                ;;
            --production)
                PRODUCTION_MODE=true
                shift
                ;;
            --docker)
                DOCKER_MODE=true
                shift
                ;;
            --install-deps)
                INSTALL_DEPS=true
                shift
                ;;
            --force-kill)
                FORCE_KILL=true
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

# Show help message
show_help() {
    cat << EOF
Luna-Services Universal MCP System - Development Startup Script

Usage: $0 [options]

Options:
    --frontend-only     Start only the frontend development server (Vite)
    --backend-only      Start only the backend FastAPI server
    --production        Start in production mode (build and serve optimized)
    --docker            Use Docker Compose for containerized development
    --install-deps      Force reinstall all dependencies before starting
    --force-kill        Kill any existing server processes before starting
    --help              Show this help message

Examples:
    $0                          # Start both frontend and backend in development mode
    $0 --frontend-only          # Start only React/Vite frontend
    $0 --backend-only           # Start only FastAPI backend
    $0 --production             # Build and serve production version
    $0 --docker                 # Use Docker Compose
    $0 --install-deps           # Reinstall dependencies and start servers

Environment Variables:
    NODE_ENV                    Set to 'production' for production builds
    PYTHON_ENV                  Set to 'production' for production Python setup
    SKIP_DEPENDENCY_CHECK       Set to 'true' to skip dependency validation

Ports:
    Frontend (Dev):     http://localhost:3000
    Frontend (Preview): http://localhost:4173
    Backend API:        http://localhost:8000
    API Documentation:  http://localhost:8000/docs
    MCP Dashboard:      http://localhost:8000/api/mcp

For more information, visit: https://github.com/Drago-03/Luna-Services

EOF
}

# Check system prerequisites
check_prerequisites() {
    log "Checking system prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        error "Python 3 is not installed. Please install Python 3.9+ from https://python.org/"
        exit 1
    fi
    
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f2)
    if [ "$PYTHON_VERSION" -lt 9 ]; then
        error "Python 3.9+ is required. Current version: $(python3 --version)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        error "npm is not installed. Please install npm"
        exit 1
    fi
    
    # Check pip
    if ! command -v pip3 &> /dev/null && ! command -v pip &> /dev/null; then
        error "pip is not installed. Please install pip"
        exit 1
    fi
    
    # Check if we're in Docker mode
    if [ "$DOCKER_MODE" = true ]; then
        if ! command -v docker &> /dev/null; then
            error "Docker is not installed. Please install Docker"
            exit 1
        fi
        
        if ! command -v docker-compose &> /dev/null; then
            error "Docker Compose is not installed. Please install Docker Compose"
            exit 1
        fi
    fi
    
    success "All prerequisites check passed"
}

# Validate environment variables
validate_environment() {
    log "Validating environment configuration..."
    
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        warning ".env file not found. Creating default configuration..."
        create_default_env
    fi
    
    # Source the .env file
    if [ -f "$PROJECT_ROOT/.env" ]; then
        set -a  # automatically export all variables
        source "$PROJECT_ROOT/.env"
        set +a
    fi
    
    # Check critical environment variables
    if [ -z "$VITE_CLERK_PUBLISHABLE_KEY" ]; then
        warning "VITE_CLERK_PUBLISHABLE_KEY not set in .env - authentication may not work"
    fi
    
    if [ -z "$GEMINI_API_KEY" ]; then
        warning "GEMINI_API_KEY not set in .env - AI features may not work"
    fi
    
    success "Environment validation completed"
}

# Create default .env file
create_default_env() {
    cat > "$PROJECT_ROOT/.env" << 'EOF'
# Universal MCP System Configuration - Generated by start.sh

# Clerk Authentication (Replace with your actual keys)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

# Google Gemini API Configuration (Required for AI features)
GEMINI_API_KEY=your_gemini_api_key_here

# Database Configuration
POSTGRES_DB=luna_mcp
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/luna_mcp

# JWT Configuration
JWT_SECRET_KEY=generated-jwt-secret-$(date +%s)-$(openssl rand -hex 16)
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Application Configuration
ENVIRONMENT=development
DEBUG=true
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]

# AI Service Configuration
GEMINI_MODEL=gemini-2.0-flash-exp
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=8192

# Voice Service Configuration (Optional)
RIVA_API_KEY=your_riva_api_key_here_optional

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=["py","js","ts","tsx","jsx","java","cpp","c","go","rs","php","rb","swift","kt","scala","cs","dart","r","sql","html","css","json","yaml","yml","xml","md","txt"]

# Development Configuration
NODE_ENV=development
VITE_DEV_PORT=3000
BACKEND_PORT=8000
EOF
    
    warning "Default .env file created. Please update with your actual API keys!"
}

# Install dependencies
install_dependencies() {
    if [ "$INSTALL_DEPS" = true ] || [ ! -d "node_modules" ] || [ "$SKIP_DEPENDENCY_CHECK" != "true" ]; then
        log "Installing/updating frontend dependencies..."
        
        # Install frontend dependencies
        if ! npm install; then
            error "Failed to install frontend dependencies"
            exit 1
        fi
        
        success "Frontend dependencies installed successfully"
    fi
    
    if [ "$INSTALL_DEPS" = true ] || [ ! -d "$BACKEND_DIR/venv" ] || [ "$SKIP_DEPENDENCY_CHECK" != "true" ]; then
        log "Installing/updating backend dependencies..."
        
        cd "$BACKEND_DIR"
        
        # Create virtual environment if it doesn't exist
        if [ ! -d "venv" ]; then
            log "Creating Python virtual environment..."
            python3 -m venv venv
        fi
        
        # Activate virtual environment
        source venv/bin/activate
        
        # Upgrade pip
        pip install --upgrade pip
        
        # Install dependencies with error handling
        if [ -f "install-deps.sh" ]; then
            log "Using custom dependency installation script..."
            chmod +x install-deps.sh
            ./install-deps.sh
        else
            log "Installing Python dependencies from requirements.txt..."
            if ! pip install -r requirements.txt; then
                warning "Some dependencies failed to install, but continuing..."
            fi
        fi
        
        cd "$PROJECT_ROOT"
        success "Backend dependencies installation completed"
    fi
}

# Kill existing processes
kill_existing_processes() {
    if [ "$FORCE_KILL" = true ] || [ -f "$PID_FILE" ]; then
        log "Checking for existing server processes..."
        
        # Kill processes using the common ports
        for port in 3000 4173 8000; do
            local pid=$(lsof -ti:$port)
            if [ ! -z "$pid" ]; then
                warning "Killing process on port $port (PID: $pid)"
                kill -9 $pid 2>/dev/null || true
            fi
        done
        
        # Clean up PID file
        if [ -f "$PID_FILE" ]; then
            rm "$PID_FILE"
        fi
        
        sleep 2
        success "Existing processes cleaned up"
    fi
}

# Start backend server
start_backend() {
    if [ "$FRONTEND_ONLY" = true ]; then
        return 0
    fi
    
    log "Starting FastAPI backend server..."
    
    cd "$BACKEND_DIR"
    
    # Activate virtual environment
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
    fi
    
    # Set Python path
    export PYTHONPATH="$BACKEND_DIR:$PYTHONPATH"
    
    # Start the server
    if [ "$PRODUCTION_MODE" = true ]; then
        log "Starting backend in production mode..."
        nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4 > "$LOG_DIR/backend.log" 2>&1 &
    else
        log "Starting backend in development mode with auto-reload..."
        nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload > "$LOG_DIR/backend.log" 2>&1 &
    fi
    
    BACKEND_PID=$!
    echo "backend:$BACKEND_PID" >> "$PID_FILE"
    
    cd "$PROJECT_ROOT"
    
    # Wait for backend to start
    log "Waiting for backend to start..."
    for i in {1..30}; do
        if curl -f http://localhost:8000/health >/dev/null 2>&1; then
            success "Backend server started successfully (PID: $BACKEND_PID)"
            break
        fi
        if [ $i -eq 30 ]; then
            error "Backend failed to start within 60 seconds"
            cat "$LOG_DIR/backend.log" || true
            exit 1
        fi
        sleep 2
        echo -n "."
    done
    echo ""
}

# Start frontend server
start_frontend() {
    if [ "$BACKEND_ONLY" = true ]; then
        return 0
    fi
    
    log "Starting React/Vite frontend server..."
    
    if [ "$PRODUCTION_MODE" = true ]; then
        log "Building frontend for production..."
        if ! npm run build; then
            error "Frontend build failed"
            exit 1
        fi
        
        log "Starting frontend preview server..."
        nohup npm run preview > "$LOG_DIR/frontend.log" 2>&1 &
        FRONTEND_PID=$!
        echo "frontend:$FRONTEND_PID" >> "$PID_FILE"
        
        success "Frontend preview server started (PID: $FRONTEND_PID)"
        info "Frontend available at: http://localhost:4173"
    else
        log "Starting frontend development server..."
        nohup npm run dev > "$LOG_DIR/frontend.log" 2>&1 &
        FRONTEND_PID=$!
        echo "frontend:$FRONTEND_PID" >> "$PID_FILE"
        
        # Wait for frontend to start
        log "Waiting for frontend to start..."
        for i in {1..30}; do
            if curl -f http://localhost:3000 >/dev/null 2>&1; then
                success "Frontend development server started successfully (PID: $FRONTEND_PID)"
                break
            fi
            if [ $i -eq 30 ]; then
                error "Frontend failed to start within 60 seconds"
                cat "$LOG_DIR/frontend.log" || true
                exit 1
            fi
            sleep 2
            echo -n "."
        done
        echo ""
        
        success "Frontend development server started (PID: $FRONTEND_PID)"
        info "Frontend available at: http://localhost:3000"
    fi
}

# Start with Docker Compose
start_docker() {
    log "Starting services with Docker Compose..."
    
    # Check which compose file to use
    if [ -f "docker-compose.mcp.yml" ]; then
        COMPOSE_FILE="docker-compose.mcp.yml"
        log "Using MCP-specific compose file: $COMPOSE_FILE"
    else
        COMPOSE_FILE="docker-compose.yml"
        log "Using standard compose file: $COMPOSE_FILE"
    fi
    
    # Start services
    if [ "$PRODUCTION_MODE" = true ]; then
        docker-compose -f "$COMPOSE_FILE" up -d --build
    else
        docker-compose -f "$COMPOSE_FILE" up -d
    fi
    
    # Wait for services
    log "Waiting for Docker services to start..."
    sleep 15
    
    # Check service health
    if docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        success "Docker services started successfully"
        
        # Display service URLs
        echo ""
        info "🐳 Docker Services Status:"
        docker-compose -f "$COMPOSE_FILE" ps
        echo ""
        info "📱 Service URLs:"
        info "   • Frontend:     http://localhost:3000"
        info "   • Backend API:  http://localhost:8000"
        info "   • API Docs:     http://localhost:8000/docs"
        info "   • MCP Dashboard: http://localhost:8000/api/mcp"
        echo ""
    else
        error "Failed to start Docker services"
        docker-compose -f "$COMPOSE_FILE" logs
        exit 1
    fi
}

# Health check for services
run_health_checks() {
    if [ "$DOCKER_MODE" = true ]; then
        return 0  # Docker health checks are handled separately
    fi
    
    log "Running health checks..."
    
    # Check backend health
    if [ "$FRONTEND_ONLY" != true ]; then
        if curl -f http://localhost:8000/health >/dev/null 2>&1; then
            success "✅ Backend health check passed"
        else
            error "❌ Backend health check failed"
            return 1
        fi
    fi
    
    # Check frontend availability
    if [ "$BACKEND_ONLY" != true ]; then
        local frontend_port
        if [ "$PRODUCTION_MODE" = true ]; then
            frontend_port=4173
        else
            frontend_port=3000
        fi
        
        if curl -f http://localhost:$frontend_port >/dev/null 2>&1; then
            success "✅ Frontend health check passed"
        else
            error "❌ Frontend health check failed"
            return 1
        fi
    fi
}

# Display startup summary
show_startup_summary() {
    echo ""
    echo -e "${GREEN}🚀 Luna-Services Universal MCP System Started Successfully!${NC}"
    echo "======================================================================"
    echo ""
    
    if [ "$DOCKER_MODE" = true ]; then
        echo -e "${BLUE}🐳 Running in Docker Mode${NC}"
        echo ""
        echo "📱 Access Points:"
        echo "   • Frontend:      http://localhost:3000"
        echo "   • Backend API:   http://localhost:8000"
        echo "   • API Docs:      http://localhost:8000/docs"
        echo "   • MCP Dashboard: http://localhost:8000/api/mcp"
        echo ""
        echo "🔧 Docker Management:"
        echo "   • View logs:     docker-compose logs -f"
        echo "   • Stop services: docker-compose down"
        echo "   • Restart:       docker-compose restart"
    else
        echo -e "${BLUE}💻 Running in Local Development Mode${NC}"
        echo ""
        echo "📱 Access Points:"
        
        if [ "$BACKEND_ONLY" != true ]; then
            if [ "$PRODUCTION_MODE" = true ]; then
                echo "   • Frontend:      http://localhost:4173 (Production Preview)"
            else
                echo "   • Frontend:      http://localhost:3000 (Development)"
            fi
        fi
        
        if [ "$FRONTEND_ONLY" != true ]; then
            echo "   • Backend API:   http://localhost:8000"
            echo "   • API Docs:      http://localhost:8000/docs"
            echo "   • Redoc Docs:    http://localhost:8000/redoc"
            echo "   • MCP Dashboard: http://localhost:8000/api/mcp"
        fi
        
        echo ""
        echo "📊 Logs:"
        echo "   • Backend:       tail -f $LOG_DIR/backend.log"
        echo "   • Frontend:      tail -f $LOG_DIR/frontend.log"
        echo ""
        echo "🛑 Stop Services:"
        echo "   • Kill processes: pkill -f \"uvicorn\\|vite\""
        echo "   • Or use:        ./scripts/stop.sh (if available)"
    fi
    
    echo ""
    echo "🔗 Useful Links:"
    echo "   • Project Repository: https://github.com/Drago-03/Luna-Services"
    echo "   • MCP Documentation:  http://localhost:8000/api/mcp/docs"
    echo "   • Health Check:       http://localhost:8000/health"
    echo ""
    echo "⚠️  Important Notes:"
    echo "   • Update your API keys in .env file for full functionality"
    echo "   • Ensure PostgreSQL and Redis are running for database features"
    echo "   • Check firewall settings if services are not accessible"
    echo ""
    echo -e "${YELLOW}🎉 Happy coding with Universal MCP System! 🚀${NC}"
}

# Cleanup function for graceful shutdown
cleanup() {
    if [ "$DOCKER_MODE" != true ] && [ -f "$PID_FILE" ]; then
        log "Cleaning up processes..."
        
        while IFS=: read -r service pid; do
            if [ ! -z "$pid" ] && kill -0 "$pid" 2>/dev/null; then
                log "Stopping $service (PID: $pid)"
                kill "$pid" 2>/dev/null || true
            fi
        done < "$PID_FILE"
        
        rm -f "$PID_FILE"
    fi
}

# Set up signal handlers for graceful shutdown
trap cleanup EXIT INT TERM

# Main execution function
main() {
    echo -e "${PURPLE}"
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                    Luna-Services Universal MCP System                       ║"
    echo "║                         Development Startup Script                          ║"
    echo "║                                                                              ║"
    echo "║  🚀 Starting AI-Powered Development Assistant with Voice & Multi-Modal      ║"
    echo "║     Capabilities powered by Google Gemini and Model Context Protocol        ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    
    # Parse command line arguments
    parse_arguments "$@"
    
    # Create necessary directories
    create_log_dir
    
    # Run startup checks
    check_prerequisites
    validate_environment
    
    # Kill existing processes if requested
    kill_existing_processes
    
    # Install dependencies
    install_dependencies
    
    # Start services based on mode
    if [ "$DOCKER_MODE" = true ]; then
        start_docker
    else
        start_backend
        start_frontend
        
        # Run health checks
        if ! run_health_checks; then
            error "Health checks failed. Check logs for details."
            exit 1
        fi
    fi
    
    # Show startup summary
    show_startup_summary
    
    # Keep script running if not in Docker mode
    if [ "$DOCKER_MODE" != true ]; then
        log "Press Ctrl+C to stop all services"
        
        # Monitor processes
        while true; do
            sleep 10
            
            if [ -f "$PID_FILE" ]; then
                while IFS=: read -r service pid; do
                    if [ ! -z "$pid" ] && ! kill -0 "$pid" 2>/dev/null; then
                        warning "$service process (PID: $pid) has stopped unexpectedly"
                    fi
                done < "$PID_FILE"
            fi
        done
    fi
}

# Run main function with all arguments
main "$@"
