#!/bin/bash

#
# Universal MCP System Deployment Script
# 
# This script automates the complete deployment of the Universal Model Context Protocol
# system including all dependencies, configurations, and health checks.
#
# Usage: ./deploy-mcp.sh [environment]
# Environments: development, staging, production
#

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENVIRONMENT="${1:-development}"

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
    log "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        error "Python 3 is not installed. Please install Python 3.11+ first."
        exit 1
    fi
    
    success "All prerequisites are installed"
}

# Environment setup
setup_environment() {
    log "Setting up environment for: $ENVIRONMENT"
    
    cd "$PROJECT_ROOT"
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        log "Creating .env file from template..."
        cp .env.example .env 2>/dev/null || cat > .env << EOF
# Luna-Services MCP Environment Configuration

# Environment
NODE_ENV=$ENVIRONMENT
PYTHON_ENV=$ENVIRONMENT

# Core API Configuration
JWT_SECRET=$(openssl rand -hex 32)
DATABASE_URL=postgresql://luna_user:luna_password@postgres:5432/luna_db
REDIS_URL=redis://redis:6379/0

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
SLACK_WEBHOOK_URL=your-slack-webhook-url

# Database Configuration
POSTGRES_DB=luna_db
POSTGRES_USER=luna_user
POSTGRES_PASSWORD=luna_password

# Security
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
EOF
        warning "Created .env file with default values. Please update the API keys!"
    fi
    
    success "Environment configuration ready"
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."
    
    cd "$PROJECT_ROOT"
    
    # Frontend dependencies
    log "Installing frontend dependencies..."
    npm install
    
    # Backend dependencies
    log "Installing backend dependencies..."
    cd backend
    pip install -r requirements.txt
    cd ..
    
    success "Dependencies installed"
}

# Build application
build_application() {
    log "Building application..."
    
    cd "$PROJECT_ROOT"
    
    # Build frontend
    log "Building frontend..."
    npm run build
    
    success "Application built successfully"
}

# Database setup
setup_database() {
    log "Setting up database..."
    
    cd "$PROJECT_ROOT"
    
    # Start PostgreSQL and Redis
    docker-compose up -d postgres redis
    
    # Wait for PostgreSQL to be ready
    log "Waiting for PostgreSQL to be ready..."
    while ! docker-compose exec -T postgres pg_isready -U luna_user -d luna_db; do
        sleep 2
    done
    
    # Run database migrations
    log "Running database migrations..."
    cd backend
    alembic upgrade head 2>/dev/null || log "Migrations not configured yet"
    cd ..
    
    success "Database setup complete"
}

# Start services
start_services() {
    log "Starting all services..."
    
    cd "$PROJECT_ROOT"
    
    # Start all services
    docker-compose up -d
    
    # Wait for services to be ready
    log "Waiting for services to start..."
    sleep 30
    
    success "All services started"
}

# Health checks
run_health_checks() {
    log "Running health checks..."
    
    cd "$PROJECT_ROOT"
    
    # Check backend health
    log "Checking backend health..."
    max_attempts=30
    attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -f http://localhost:8000/health > /dev/null; then
            success "Backend is healthy"
            break
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            error "Backend health check failed after $max_attempts attempts"
            docker-compose logs backend
            exit 1
        fi
        
        log "Attempt $attempt/$max_attempts - Backend not ready yet..."
        sleep 5
        attempt=$((attempt + 1))
    done
    
    # Check frontend (if running)
    if [ "$ENVIRONMENT" = "development" ]; then
        log "Checking frontend availability..."
        if curl -s -f http://localhost:3000 > /dev/null; then
            success "Frontend is accessible"
        else
            warning "Frontend is not accessible at http://localhost:3000"
        fi
    fi
    
    # Check MCP API
    log "Checking MCP API..."
    if curl -s -f http://localhost:8000/api/mcp/status > /dev/null; then
        success "MCP API is healthy"
    else
        error "MCP API health check failed"
        exit 1
    fi
    
    # Check database connection
    log "Checking database connection..."
    if docker-compose exec -T postgres psql -U luna_user -d luna_db -c "SELECT 1;" > /dev/null; then
        success "Database connection is working"
    else
        error "Database connection failed"
        exit 1
    fi
    
    # Check Redis connection
    log "Checking Redis connection..."
    if docker-compose exec -T redis redis-cli ping | grep -q PONG; then
        success "Redis connection is working"
    else
        error "Redis connection failed"
        exit 1
    fi
    
    success "All health checks passed"
}

# Test MCP functionality
test_mcp_functionality() {
    log "Testing MCP functionality..."
    
    # Test basic API endpoints
    log "Testing MCP status endpoint..."
    response=$(curl -s http://localhost:8000/api/mcp/status)
    if echo "$response" | grep -q "operational"; then
        success "MCP status endpoint working"
    else
        error "MCP status endpoint failed"
        echo "Response: $response"
    fi
    
    # Test supported languages endpoint
    log "Testing supported languages endpoint..."
    if curl -s -f http://localhost:8000/api/mcp/languages > /dev/null; then
        success "Supported languages endpoint working"
    else
        warning "Supported languages endpoint not accessible"
    fi
    
    success "MCP functionality tests complete"
}

# Generate deployment report
generate_report() {
    log "Generating deployment report..."
    
    cd "$PROJECT_ROOT"
    
    cat > deployment-report.txt << EOF
Universal MCP Deployment Report
==============================

Deployment Date: $(date)
Environment: $ENVIRONMENT
Git Commit: $(git rev-parse HEAD 2>/dev/null || echo "Not a git repository")

Services Status:
$(docker-compose ps)

Service URLs:
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/api/docs
- MCP API: http://localhost:8000/api/mcp
- Frontend: http://localhost:3000 (development)

Health Check Results:
$(curl -s http://localhost:8000/health 2>/dev/null || echo "Health check failed")

MCP Status:
$(curl -s http://localhost:8000/api/mcp/status 2>/dev/null || echo "MCP status check failed")

Container Logs (last 50 lines):
Backend:
$(docker-compose logs --tail=50 backend 2>/dev/null)

Frontend:
$(docker-compose logs --tail=50 frontend 2>/dev/null)

Next Steps:
1. Update API keys in .env file if not already done
2. Test authentication by logging in at http://localhost:3000
3. Try generating code using the MCP interface
4. Check monitoring dashboards if configured

For support, visit: https://github.com/your-org/luna-services/issues
EOF
    
    success "Deployment report saved to deployment-report.txt"
}

# Cleanup function
cleanup() {
    log "Cleaning up temporary files..."
    # Add cleanup logic here if needed
}

# Print usage information
usage() {
    cat << EOF
Universal MCP Deployment Script

Usage: $0 [environment] [options]

Environments:
  development  - Local development setup (default)
  staging      - Staging environment
  production   - Production deployment

Options:
  --skip-build     Skip the build step
  --skip-health    Skip health checks
  --cleanup        Clean up and stop all services
  --help           Show this help message

Examples:
  $0                    # Deploy in development mode
  $0 production         # Deploy in production mode
  $0 --cleanup          # Stop all services and cleanup
  $0 development --skip-build

EOF
}

# Cleanup and stop services
cleanup_services() {
    log "Stopping all services and cleaning up..."
    
    cd "$PROJECT_ROOT"
    
    # Stop and remove containers
    docker-compose down
    
    # Remove volumes (optional - uncomment if needed)
    # docker-compose down -v
    
    # Clean up Docker images (optional)
    # docker system prune -f
    
    success "Cleanup complete"
}

# Main deployment function
main() {
    log "Starting Universal MCP deployment..."
    log "Environment: $ENVIRONMENT"
    
    # Parse command line arguments
    skip_build=false
    skip_health=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-build)
                skip_build=true
                shift
                ;;
            --skip-health)
                skip_health=true
                shift
                ;;
            --cleanup)
                cleanup_services
                exit 0
                ;;
            --help)
                usage
                exit 0
                ;;
            development|staging|production)
                ENVIRONMENT=$1
                shift
                ;;
            *)
                error "Unknown option: $1"
                usage
                exit 1
                ;;
        esac
    done
    
    # Validate environment
    if [[ ! "$ENVIRONMENT" =~ ^(development|staging|production)$ ]]; then
        error "Invalid environment: $ENVIRONMENT"
        usage
        exit 1
    fi
    
    # Run deployment steps
    check_prerequisites
    setup_environment
    install_dependencies
    
    if [ "$skip_build" = false ]; then
        build_application
    else
        log "Skipping build step"
    fi
    
    setup_database
    start_services
    
    if [ "$skip_health" = false ]; then
        run_health_checks
        test_mcp_functionality
    else
        log "Skipping health checks"
    fi
    
    generate_report
    
    success "Universal MCP deployment completed successfully!"
    
    cat << EOF

🚀 Universal MCP System Deployed Successfully!

Access Points:
- API Documentation: http://localhost:8000/api/docs
- MCP Dashboard: http://localhost:3000/mcp
- Backend API: http://localhost:8000
- Health Check: http://localhost:8000/health

Important Next Steps:
1. Update your .env file with valid API keys (especially GEMINI_API_KEY)
2. Test the system by logging in at http://localhost:3000
3. Try the MCP features in the dashboard
4. Review the deployment report: deployment-report.txt

For troubleshooting:
- View logs: docker-compose logs [service_name]
- Restart services: docker-compose restart
- Check status: docker-compose ps

Happy coding with Universal MCP! 🎉
EOF
}

# Set trap for cleanup on script exit
trap cleanup EXIT

# Run main function
main "$@"
