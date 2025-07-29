#!/bin/bash

#
# Luna-Services Universal MCP System - Development Helper Script
# 
# This script provides various development utilities for the Luna-Services project
# including status checking, log viewing, dependency management, and more.
#
# Usage: ./dev.sh [command] [options]
#

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"
PID_FILE="$PROJECT_ROOT/.server_pids"
LOG_DIR="$PROJECT_ROOT/logs"

# Logging functions
log() { echo -e "${BLUE}[$(date +'%H:%M:%S')] INFO:${NC} $1"; }
success() { echo -e "${GREEN}[$(date +'%H:%M:%S')] SUCCESS:${NC} $1"; }
warning() { echo -e "${YELLOW}[$(date +'%H:%M:%S')] WARNING:${NC} $1"; }
error() { echo -e "${RED}[$(date +'%H:%M:%S')] ERROR:${NC} $1"; }
info() { echo -e "${CYAN}[$(date +'%H:%M:%S')] INFO:${NC} $1"; }

# Show help
show_help() {
    cat << EOF
Luna-Services Universal MCP System - Development Helper

Usage: $0 [command] [options]

Commands:
    status          Show status of all services
    logs            Show logs (use with --backend, --frontend, or --all)
    restart         Restart specific service (use with --backend or --frontend)
    update-deps     Update all dependencies
    build           Build the project
    test            Run tests
    lint            Run linting
    clean           Clean build artifacts and cache
    backup          Create backup of important files
    restore         Restore from backup
    env             Show environment information
    ports           Show which ports are in use
    ps              Show running processes
    health          Run health checks
    help            Show this help message

Options:
    --backend       Target backend service
    --frontend      Target frontend service
    --docker        Use Docker mode
    --all           Target all services
    --watch         Keep watching (for logs)
    --follow        Follow log output
    --lines N       Show last N lines (default: 50)

Examples:
    $0 status                   # Show service status
    $0 logs --backend --watch   # Watch backend logs
    $0 restart --frontend       # Restart only frontend
    $0 update-deps              # Update all dependencies
    $0 health                   # Run health checks

EOF
}

# Check service status
check_status() {
    echo -e "${PURPLE}🔍 Luna-Services System Status${NC}"
    echo "================================"
    echo ""
    
    # Check if running in Docker
    if docker-compose ps 2>/dev/null | grep -q "Up"; then
        echo -e "${BLUE}🐳 Docker Mode - Active${NC}"
        echo ""
        docker-compose ps
        return 0
    fi
    
    echo -e "${BLUE}💻 Local Development Mode${NC}"
    echo ""
    
    # Check process status
    local backend_status="❌ Stopped"
    local frontend_status="❌ Stopped"
    
    # Check backend (port 8000)
    if lsof -ti:8000 >/dev/null 2>&1; then
        backend_status="✅ Running (Port 8000)"
        local backend_pid=$(lsof -ti:8000)
        backend_status="✅ Running (Port 8000, PID: $backend_pid)"
    fi
    
    # Check frontend (ports 3000 or 4173)
    if lsof -ti:3000 >/dev/null 2>&1; then
        local frontend_pid=$(lsof -ti:3000)
        frontend_status="✅ Running Dev Server (Port 3000, PID: $frontend_pid)"
    elif lsof -ti:4173 >/dev/null 2>&1; then
        local frontend_pid=$(lsof -ti:4173)
        frontend_status="✅ Running Preview Server (Port 4173, PID: $frontend_pid)"
    fi
    
    echo "Backend API:       $backend_status"
    echo "Frontend Server:   $frontend_status"
    echo ""
    
    # Show URLs if services are running
    if [[ $backend_status == *"Running"* ]]; then
        echo "🔗 Backend URLs:"
        echo "   • API:          http://localhost:8000"
        echo "   • Docs:         http://localhost:8000/docs"
        echo "   • Health:       http://localhost:8000/health"
        echo "   • MCP:          http://localhost:8000/api/mcp"
    fi
    
    if [[ $frontend_status == *"Running"* ]]; then
        echo "🔗 Frontend URLs:"
        if [[ $frontend_status == *"3000"* ]]; then
            echo "   • Dev Server:   http://localhost:3000"
        else
            echo "   • Preview:      http://localhost:4173"
        fi
    fi
    
    echo ""
    
    # Show memory usage
    if [[ $backend_status == *"Running"* ]] || [[ $frontend_status == *"Running"* ]]; then
        echo "💾 Resource Usage:"
        ps aux | grep -E "(uvicorn|vite|node.*luna)" | grep -v grep | while read -r line; do
            echo "   $line" | awk '{printf "   %-15s %5s %5s %s\n", $11, $3"%", $4"%", $2}'
        done
    fi
}

# Show logs
show_logs() {
    local target="all"
    local follow=false
    local lines=50
    
    # Parse options
    while [[ $# -gt 0 ]]; do
        case $1 in
            --backend) target="backend"; shift ;;
            --frontend) target="frontend"; shift ;;
            --all) target="all"; shift ;;
            --watch|--follow) follow=true; shift ;;
            --lines) lines="$2"; shift 2 ;;
            *) shift ;;
        esac
    done
    
    if [ ! -d "$LOG_DIR" ]; then
        warning "Log directory not found. Services may not be running or logs not configured."
        return 1
    fi
    
    echo -e "${BLUE}📋 Viewing Logs (Last $lines lines)${NC}"
    echo "=================================="
    echo ""
    
    if [ "$target" = "backend" ] || [ "$target" = "all" ]; then
        if [ -f "$LOG_DIR/backend.log" ]; then
            echo -e "${CYAN}🔧 Backend Logs:${NC}"
            if [ "$follow" = true ]; then
                tail -f -n "$lines" "$LOG_DIR/backend.log"
            else
                tail -n "$lines" "$LOG_DIR/backend.log"
            fi
            echo ""
        fi
    fi
    
    if [ "$target" = "frontend" ] || [ "$target" = "all" ]; then
        if [ -f "$LOG_DIR/frontend.log" ]; then
            echo -e "${CYAN}⚛️  Frontend Logs:${NC}"
            if [ "$follow" = true ]; then
                tail -f -n "$lines" "$LOG_DIR/frontend.log"
            else
                tail -n "$lines" "$LOG_DIR/frontend.log"
            fi
        fi
    fi
}

# Restart services
restart_service() {
    local target="all"
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --backend) target="backend"; shift ;;
            --frontend) target="frontend"; shift ;;
            --all) target="all"; shift ;;
            *) shift ;;
        esac
    done
    
    echo -e "${YELLOW}🔄 Restarting Services${NC}"
    echo "======================"
    echo ""
    
    if [ "$target" = "backend" ] || [ "$target" = "all" ]; then
        log "Restarting backend..."
        if lsof -ti:8000 >/dev/null 2>&1; then
            kill $(lsof -ti:8000) 2>/dev/null || true
            sleep 2
        fi
        ./start.sh --backend-only &
        success "Backend restart initiated"
    fi
    
    if [ "$target" = "frontend" ] || [ "$target" = "all" ]; then
        log "Restarting frontend..."
        for port in 3000 4173; do
            if lsof -ti:$port >/dev/null 2>&1; then
                kill $(lsof -ti:$port) 2>/dev/null || true
            fi
        done
        sleep 2
        ./start.sh --frontend-only &
        success "Frontend restart initiated"
    fi
}

# Update dependencies
update_dependencies() {
    echo -e "${BLUE}📦 Updating Dependencies${NC}"
    echo "========================="
    echo ""
    
    # Update frontend dependencies
    log "Updating frontend dependencies..."
    npm update
    npm audit fix --force 2>/dev/null || true
    success "Frontend dependencies updated"
    
    # Update backend dependencies
    log "Updating backend dependencies..."
    cd "$PROJECT_ROOT/backend"
    
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
        pip install --upgrade pip
        pip install --upgrade -r requirements.txt
        success "Backend dependencies updated"
    else
        warning "Python virtual environment not found. Run ./start.sh --install-deps first."
    fi
    
    cd "$PROJECT_ROOT"
}

# Build project
build_project() {
    echo -e "${BLUE}🏗️  Building Project${NC}"
    echo "==================="
    echo ""
    
    log "Building frontend..."
    npm run build
    success "Frontend build completed"
    
    log "Checking backend..."
    cd "$PROJECT_ROOT/backend"
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
        python -m py_compile app/main.py
        success "Backend syntax check passed"
    fi
    cd "$PROJECT_ROOT"
    
    success "Project build completed successfully"
}

# Run tests
run_tests() {
    echo -e "${BLUE}🧪 Running Tests${NC}"
    echo "================"
    echo ""
    
    # Frontend tests
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        log "Running frontend tests..."
        npm test
    else
        warning "No frontend tests configured"
    fi
    
    # Backend tests
    cd "$PROJECT_ROOT/backend"
    if [ -f "pytest.ini" ] || [ -d "tests" ]; then
        log "Running backend tests..."
        if [ -f "venv/bin/activate" ]; then
            source venv/bin/activate
            pytest
        fi
    else
        warning "No backend tests found"
    fi
    cd "$PROJECT_ROOT"
}

# Run linting
run_linting() {
    echo -e "${BLUE}✨ Running Linting${NC}"
    echo "=================="
    echo ""
    
    # Frontend linting
    log "Linting frontend code..."
    npm run lint
    
    # Backend linting
    cd "$PROJECT_ROOT/backend"
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
        
        if command -v black >/dev/null 2>&1; then
            log "Running Black formatter..."
            black . --check
        fi
        
        if command -v flake8 >/dev/null 2>&1; then
            log "Running Flake8 linter..."
            flake8 .
        fi
    fi
    cd "$PROJECT_ROOT"
    
    success "Linting completed"
}

# Clean project
clean_project() {
    echo -e "${BLUE}🧹 Cleaning Project${NC}"
    echo "==================="
    echo ""
    
    # Clean frontend
    log "Cleaning frontend artifacts..."
    rm -rf dist/ node_modules/.cache/
    
    # Clean backend
    log "Cleaning backend artifacts..."
    find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
    find . -type f -name "*.pyc" -delete 2>/dev/null || true
    
    # Clean logs
    if [ -d "$LOG_DIR" ]; then
        rm -f "$LOG_DIR"/*.log
        log "Cleaned log files"
    fi
    
    success "Project cleaned successfully"
}

# Show environment info
show_environment() {
    echo -e "${PURPLE}🌍 Environment Information${NC}"
    echo "============================"
    echo ""
    
    echo "📍 System Information:"
    echo "   OS:              $(uname -s)"
    echo "   Architecture:    $(uname -m)"
    echo "   Node.js:         $(node --version 2>/dev/null || echo 'Not installed')"
    echo "   npm:             $(npm --version 2>/dev/null || echo 'Not installed')"
    echo "   Python:          $(python3 --version 2>/dev/null || echo 'Not installed')"
    echo "   Docker:          $(docker --version 2>/dev/null || echo 'Not installed')"
    echo ""
    
    echo "📂 Project Information:"
    echo "   Root:            $PROJECT_ROOT"
    echo "   Git Branch:      $(git branch --show-current 2>/dev/null || echo 'Not a git repo')"
    echo "   Git Commit:      $(git rev-parse --short HEAD 2>/dev/null || echo 'Not a git repo')"
    echo ""
    
    echo "🔐 Environment Variables:"
    echo "   NODE_ENV:        ${NODE_ENV:-'not set'}"
    echo "   ENVIRONMENT:     ${ENVIRONMENT:-'not set'}"
    echo "   GEMINI_API_KEY:  $([ -n "$GEMINI_API_KEY" ] && echo 'Set' || echo 'Not set')"
    echo "   CLERK_SECRET:    $([ -n "$CLERK_SECRET_KEY" ] && echo 'Set' || echo 'Not set')"
}

# Show port usage
show_ports() {
    echo -e "${BLUE}🔌 Port Usage${NC}"
    echo "============="
    echo ""
    
    for port in 3000 4173 8000 5432 6379; do
        local pid=$(lsof -ti:$port 2>/dev/null || echo "")
        if [ -n "$pid" ]; then
            local process=$(ps -p $pid -o comm= 2>/dev/null || echo "unknown")
            echo "Port $port: ✅ In use by $process (PID: $pid)"
        else
            echo "Port $port: ⭕ Available"
        fi
    done
}

# Show running processes
show_processes() {
    echo -e "${BLUE}⚙️  Running Processes${NC}"
    echo "===================="
    echo ""
    
    ps aux | grep -E "(uvicorn|vite|node|python)" | grep -v grep | while read -r line; do
        echo "$line" | awk '{printf "%-10s %5s %5s %-50s\n", $2, $3"%", $4"%", $11}'
    done
}

# Run health checks
run_health_checks() {
    echo -e "${BLUE}🏥 Health Checks${NC}"
    echo "================"
    echo ""
    
    # Backend health
    if curl -f http://localhost:8000/health >/dev/null 2>&1; then
        success "✅ Backend health check passed"
        
        # Get detailed health info
        local health_data=$(curl -s http://localhost:8000/health 2>/dev/null)
        if [ -n "$health_data" ]; then
            echo "   Response: $health_data"
        fi
    else
        error "❌ Backend health check failed"
    fi
    
    # Frontend health
    local frontend_port
    if lsof -ti:3000 >/dev/null 2>&1; then
        frontend_port=3000
    elif lsof -ti:4173 >/dev/null 2>&1; then
        frontend_port=4173
    fi
    
    if [ -n "$frontend_port" ]; then
        if curl -f http://localhost:$frontend_port >/dev/null 2>&1; then
            success "✅ Frontend health check passed (Port $frontend_port)"
        else
            error "❌ Frontend health check failed (Port $frontend_port)"
        fi
    else
        warning "⚠️  Frontend not running"
    fi
    
    # Database health (if running)
    if command -v pg_isready >/dev/null 2>&1; then
        if pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
            success "✅ PostgreSQL database is ready"
        else
            warning "⚠️  PostgreSQL database not accessible"
        fi
    fi
    
    # Redis health (if running)
    if command -v redis-cli >/dev/null 2>&1; then
        if redis-cli -h localhost -p 6379 ping >/dev/null 2>&1; then
            success "✅ Redis is responding"
        else
            warning "⚠️  Redis not accessible"
        fi
    fi
}

# Main function
main() {
    local command="$1"
    shift
    
    case "$command" in
        status)
            check_status
            ;;
        logs)
            show_logs "$@"
            ;;
        restart)
            restart_service "$@"
            ;;
        update-deps)
            update_dependencies
            ;;
        build)
            build_project
            ;;
        test)
            run_tests
            ;;
        lint)
            run_linting
            ;;
        clean)
            clean_project
            ;;
        env)
            show_environment
            ;;
        ports)
            show_ports
            ;;
        ps)
            show_processes
            ;;
        health)
            run_health_checks
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            if [ -z "$command" ]; then
                show_help
            else
                error "Unknown command: $command"
                echo ""
                show_help
                exit 1
            fi
            ;;
    esac
}

# Run main function
main "$@"
