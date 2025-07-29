#!/bin/bash

# Quick Setup Script for Universal MCP System
# This script provides a fast way to get the system running for development

set -e

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Universal MCP System - Quick Setup${NC}"
echo "========================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << 'EOF'
# Universal MCP System Configuration

# Google Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Database Configuration
POSTGRES_DB=luna_mcp
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/luna_mcp

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Application Configuration
ENVIRONMENT=development
DEBUG=true
CORS_ORIGINS=["http://localhost:3000"]

# AI Service Configuration
GEMINI_MODEL=gemini-2.0-flash-exp
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=8192

# Voice Service Configuration (Optional)
RIVA_API_KEY=your_riva_api_key_here_optional

# Monitoring Configuration
PROMETHEUS_PORT=9090
GRAFANA_PORT=3001
GRAFANA_PASSWORD=admin

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=["py", "js", "ts", "tsx", "jsx", "java", "cpp", "c", "go", "rs", "php", "rb", "swift", "kt", "scala", "cs", "dart", "r", "sql", "html", "css", "json", "yaml", "yml", "xml", "md", "txt"]
EOF
    echo -e "${YELLOW}⚠️  Please edit .env file with your actual API keys!${NC}"
fi

# Quick Docker setup
echo -e "${BLUE}Starting services with Docker Compose...${NC}"

# Check if docker-compose.mcp.yml exists, if not use regular docker-compose
if [ -f "docker-compose.mcp.yml" ]; then
    docker-compose -f docker-compose.mcp.yml up -d
else
    echo -e "${YELLOW}Using regular docker-compose.yml (MCP-specific compose file not found)${NC}"
    docker-compose up -d
fi

echo -e "${BLUE}Waiting for services to start...${NC}"
sleep 10

# Check if services are running
echo -e "${BLUE}Checking service health...${NC}"

# Wait for database
echo -n "Waiting for database..."
for i in {1..30}; do
    if docker ps --format "table {{.Names}}" | grep -q postgres || \
       docker ps --format "table {{.Names}}" | grep -q mcp-postgres; then
        echo -e " ${GREEN}✓${NC}"
        break
    fi
    echo -n "."
    sleep 2
done

# Wait for backend
echo -n "Waiting for backend API..."
for i in {1..30}; do
    if curl -f http://localhost:8000/health > /dev/null 2>&1 || \
       curl -f http://localhost:8000/ > /dev/null 2>&1; then
        echo -e " ${GREEN}✓${NC}"
        break
    fi
    echo -n "."
    sleep 2
done

# Wait for frontend
echo -n "Waiting for frontend..."
for i in {1..30}; do
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        echo -e " ${GREEN}✓${NC}"
        break
    fi
    echo -n "."
    sleep 2
done

echo ""
echo -e "${GREEN}🎉 Universal MCP System is now running!${NC}"
echo ""
echo "📱 Access Points:"
echo "   • Frontend:     http://localhost:3000"
echo "   • API:          http://localhost:8000"
echo "   • API Docs:     http://localhost:8000/docs"
echo "   • MCP Dashboard: http://localhost:3000/mcp"
echo ""
echo "🔧 Management:"
if [ -f "docker-compose.mcp.yml" ]; then
    echo "   • View logs:    docker-compose -f docker-compose.mcp.yml logs -f"
    echo "   • Stop:         docker-compose -f docker-compose.mcp.yml down"
    echo "   • Restart:      docker-compose -f docker-compose.mcp.yml restart"
else
    echo "   • View logs:    docker-compose logs -f"
    echo "   • Stop:         docker-compose down"
    echo "   • Restart:      docker-compose restart"
fi
echo ""
echo -e "${YELLOW}⚠️  Important: Don't forget to update your GEMINI_API_KEY in .env!${NC}"
echo ""
echo "🛠️  If you encounter Python dependency issues, run:"
echo "   cd backend && ./install-deps.sh"
echo ""
echo -e "${BLUE}Happy coding with Universal MCP! 🚀${NC}"
