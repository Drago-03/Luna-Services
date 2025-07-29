#!/bin/bash

#
# Luna-Services Universal MCP System - Stop Script
# 
# This script stops all running Luna-Services processes (frontend and backend)
# and cleans up any leftover processes or files.
#
# Usage: ./stop.sh [options]
# Options:
#   --docker      Stop Docker Compose services
#   --force       Force kill all processes
#   --clean       Clean logs and temporary files
#   --help        Show this help message
#

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"
PID_FILE="$PROJECT_ROOT/.server_pids"
LOG_DIR="$PROJECT_ROOT/logs"

# Options
DOCKER_MODE=false
FORCE_MODE=false
CLEAN_MODE=false

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

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --docker)
                DOCKER_MODE=true
                shift
                ;;
            --force)
                FORCE_MODE=true
                shift
                ;;
            --clean)
                CLEAN_MODE=true
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
Luna-Services Universal MCP System - Stop Script

Usage: $0 [options]

Options:
    --docker        Stop Docker Compose services instead of local processes
    --force         Force kill all processes without graceful shutdown
    --clean         Clean logs and temporary files after stopping
    --help          Show this help message

Examples:
    $0                  # Stop local development servers gracefully
    $0 --docker         # Stop Docker Compose services
    $0 --force          # Force kill all Luna-Services processes
    $0 --clean          # Stop services and clean temporary files

EOF
}

# Stop Docker services
stop_docker_services() {
    log "Stopping Docker Compose services..."
    
    # Check which compose file to use
    if [ -f "docker-compose.mcp.yml" ]; then
        COMPOSE_FILE="docker-compose.mcp.yml"
        log "Using MCP-specific compose file: $COMPOSE_FILE"
    else
        COMPOSE_FILE="docker-compose.yml"
        log "Using standard compose file: $COMPOSE_FILE"
    fi
    
    # Stop services
    if docker-compose -f "$COMPOSE_FILE" ps -q | grep -q .; then
        docker-compose -f "$COMPOSE_FILE" down
        success "Docker services stopped successfully"
    else
        warning "No running Docker services found"
    fi
    
    # Clean up volumes if requested
    if [ "$CLEAN_MODE" = true ]; then
        log "Cleaning Docker volumes..."
        docker-compose -f "$COMPOSE_FILE" down -v
        docker system prune -f
        success "Docker cleanup completed"
    fi
}

# Stop local processes
stop_local_processes() {
    log "Stopping local Luna-Services processes..."
    
    # Stop processes from PID file
    if [ -f "$PID_FILE" ]; then
        log "Stopping processes from PID file..."
        
        while IFS=: read -r service pid; do
            if [ ! -z "$pid" ] && kill -0 "$pid" 2>/dev/null; then
                if [ "$FORCE_MODE" = true ]; then
                    log "Force killing $service (PID: $pid)"
                    kill -9 "$pid" 2>/dev/null || true
                else
                    log "Gracefully stopping $service (PID: $pid)"
                    kill -TERM "$pid" 2>/dev/null || true
                    
                    # Wait for graceful shutdown
                    for i in {1..10}; do
                        if ! kill -0 "$pid" 2>/dev/null; then
                            break
                        fi
                        sleep 1
                    done
                    
                    # Force kill if still running
                    if kill -0 "$pid" 2>/dev/null; then
                        log "Force killing $service (graceful shutdown failed)"
                        kill -9 "$pid" 2>/dev/null || true
                    fi
                fi
                success "Stopped $service"
            else
                warning "$service process (PID: $pid) not found or already stopped"
            fi
        done < "$PID_FILE"
        
        rm -f "$PID_FILE"
    else
        log "No PID file found, checking for processes on common ports..."
    fi
    
    # Kill processes on common ports
    for port in 3000 4173 8000; do
        local pids=$(lsof -ti:$port 2>/dev/null || true)
        if [ ! -z "$pids" ]; then
            for pid in $pids; do
                local process_name=$(ps -p $pid -o comm= 2>/dev/null || echo "unknown")
                
                if [ "$FORCE_MODE" = true ]; then
                    log "Force killing process on port $port (PID: $pid, Process: $process_name)"
                    kill -9 "$pid" 2>/dev/null || true
                else
                    log "Gracefully stopping process on port $port (PID: $pid, Process: $process_name)"
                    kill -TERM "$pid" 2>/dev/null || true
                    sleep 2
                    
                    # Force kill if still running
                    if kill -0 "$pid" 2>/dev/null; then
                        kill -9 "$pid" 2>/dev/null || true
                    fi
                fi
            done
            success "Stopped processes on port $port"
        fi
    done
    
    # Additional cleanup for Node.js and Python processes
    if [ "$FORCE_MODE" = true ]; then
        log "Force killing any remaining Luna-Services related processes..."
        pkill -f "vite|uvicorn|fastapi" 2>/dev/null || true
        pkill -f "node.*luna|python.*luna" 2>/dev/null || true
    fi
    
    success "All local processes stopped"
}

# Clean temporary files and logs
clean_temp_files() {
    if [ "$CLEAN_MODE" = true ]; then
        log "Cleaning temporary files and logs..."
        
        # Clean log files
        if [ -d "$LOG_DIR" ]; then
            rm -f "$LOG_DIR"/*.log
            log "Cleaned log files"
        fi
        
        # Clean PID files
        rm -f "$PROJECT_ROOT"/.server_pids
        
        # Clean Node.js cache
        if [ -d "$PROJECT_ROOT/node_modules/.cache" ]; then
            rm -rf "$PROJECT_ROOT/node_modules/.cache"
            log "Cleaned Node.js cache"
        fi
        
        # Clean Python cache
        find "$PROJECT_ROOT" -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
        find "$PROJECT_ROOT" -type f -name "*.pyc" -delete 2>/dev/null || true
        
        # Clean build artifacts
        if [ -d "$PROJECT_ROOT/dist" ]; then
            rm -rf "$PROJECT_ROOT/dist"
            log "Cleaned build artifacts"
        fi
        
        success "Cleanup completed"
    fi
}

# Verify all processes are stopped
verify_stop() {
    log "Verifying all processes are stopped..."
    
    local running_processes=0
    
    # Check common ports
    for port in 3000 4173 8000; do
        if lsof -ti:$port >/dev/null 2>&1; then
            warning "Process still running on port $port"
            running_processes=$((running_processes + 1))
        fi
    done
    
    if [ $running_processes -eq 0 ]; then
        success "✅ All Luna-Services processes have been stopped"
        return 0
    else
        error "❌ Some processes are still running. Use --force to kill them."
        return 1
    fi
}

# Main execution function
main() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                    Luna-Services Universal MCP System                       ║"
    echo "║                            Stop Script                                      ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo ""
    
    # Parse command line arguments
    parse_arguments "$@"
    
    # Stop services based on mode
    if [ "$DOCKER_MODE" = true ]; then
        stop_docker_services
    else
        stop_local_processes
    fi
    
    # Clean temporary files if requested
    clean_temp_files
    
    # Verify all processes are stopped
    if verify_stop; then
        echo ""
        success "🛑 Luna-Services Universal MCP System stopped successfully!"
        echo ""
        echo "To start the system again, run:"
        echo "   ./start.sh                    # Start in development mode"
        echo "   ./start.sh --docker          # Start with Docker"
        echo "   ./start.sh --production      # Start in production mode"
        echo ""
    else
        echo ""
        error "Some processes may still be running. Check manually or use --force option."
        echo ""
        echo "To force stop all processes:"
        echo "   ./stop.sh --force"
        echo ""
    fi
}

# Run main function with all arguments
main "$@"
