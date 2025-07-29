#!/bin/bash

# Luna Services Supabase Setup Script
# This script sets up the Supabase database integration and fixes dependency conflicts

set -e  # Exit on any error

echo "🚀 Luna Services - Supabase Setup Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the Luna Services root directory"
    exit 1
fi

print_status "Setting up Luna Services with Supabase integration..."

# Step 1: Update frontend dependencies
print_status "Installing frontend dependencies..."
if command -v npm &> /dev/null; then
    npm install
    print_success "Frontend dependencies installed"
else
    print_error "npm not found. Please install Node.js and npm"
    exit 1
fi

# Step 2: Setup Python environment and fix backend dependencies
print_status "Setting up Python backend environment..."

# Check if Python is available
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    print_error "Python not found. Please install Python 3.9 or higher"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "backend/venv" ]; then
    print_status "Creating Python virtual environment..."
    cd backend
    $PYTHON_CMD -m venv venv
    cd ..
    print_success "Virtual environment created"
fi

# Activate virtual environment and install dependencies
print_status "Installing Python dependencies..."
cd backend

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Upgrade pip first
pip install --upgrade pip

# Install dependencies with conflict resolution
print_status "Resolving dependency conflicts..."

# Install core dependencies first
pip install fastapi==0.104.1
pip install uvicorn[standard]==0.24.0
pip install pydantic==2.5.0
pip install pydantic-settings==2.1.0

# Install Supabase without conflicting postgrest version
pip install supabase==2.3.4

# Install remaining dependencies
pip install -r requirements.txt

cd ..
print_success "Python dependencies installed and conflicts resolved"

# Step 3: Setup environment variables
print_status "Setting up environment variables..."

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Created .env file from .env.example"
    else
        # Create basic .env file with Supabase configuration
        cat > .env << 'EOF'
# Universal MCP System Configuration

# Supabase Configuration
VITE_SUPABASE_URL=https://tnmsadjdeenhysllhyzp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRubXNhZGpkZWVuaHlzbGxoeXpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MDI5MDIsImV4cCI6MjA2OTM3ODkwMn0.nQXubx2f5EdzcB2sRLjyytgj9dIiJ5FXQ9gxw5YJsaI
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRubXNhZGpkZWVuaHlzbGxoeXpwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzgwMjkwMiwiZXhwIjoyMDY5Mzc4OTAyfQ.VxxRTi1YX05_lZYNiW1FZk1oxTyT6QkPaRiSGTPtjcI

# Supabase Database Credentials
SUPABASE_DB_HOST=db.tnmsadjdeenhysllhyzp.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=JglPPLffmXPYaDzS

# JWT Configuration
SUPABASE_JWT_SECRET=1027f060-236b-4043-a83f-54fc361b0818

# Direct Database URLs
DATABASE_URL=postgresql://postgres:JglPPLffmXPYaDzS@db.tnmsadjdeenhysllhyzp.supabase.co:5432/postgres
DATABASE_URL_POOLER_TRANSACTION=postgresql://postgres.tnmsadjdeenhysllhyzp:JglPPLffmXPYaDzS@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
DATABASE_URL_POOLER_SESSION=postgresql://postgres.tnmsadjdeenhysllhyzp:JglPPLffmXPYaDzS@aws-0-ap-south-1.pooler.supabase.com:5432/postgres

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_Y2hhcm1lZC10YWRwb2xlLTEuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_YHLA6Vmnfaq7vRELbHK4wiDuFVyC1u0d8fratutVPC

# Google Gemini API Configuration
GEMINI_API_KEY=AIzaSyC_yfZKJMsPpR01y2injqHKdJdnESeHHBA

# JWT Configuration (for backend API verification)
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Redis Configuration
REDIS_URL=redis://mcp-redis:6379

# Application Configuration
ENVIRONMENT=development
DEBUG=true
CORS_ORIGINS=["http://localhost:3000"]

# AI Service Configuration
GEMINI_MODEL=gemini-2.0-flash-exp
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=8192

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=["py", "js", "ts", "tsx", "jsx", "java", "cpp", "c", "go", "rs", "php", "rb", "swift", "kt", "scala", "cs", "dart", "r", "sql", "html", "css", "json", "yaml", "yml", "xml", "md", "txt"]
EOF
        print_success "Created .env file with Supabase configuration"
    fi
else
    print_warning ".env file already exists. Please verify Supabase configuration."
fi

# Step 4: Check if Supabase CLI is available
print_status "Checking Supabase CLI..."
if command -v supabase &> /dev/null; then
    print_success "Supabase CLI is available"
    
    # Check if already logged in
    if supabase status &> /dev/null; then
        print_success "Supabase CLI is already connected"
    else
        print_warning "Please run 'supabase login' to connect to your Supabase project"
    fi
else
    print_warning "Supabase CLI not found. You can install it with:"
    echo "  npm install -g supabase"
    echo "  or visit: https://supabase.com/docs/guides/cli"
fi

# Step 5: Test the setup
print_status "Testing the setup..."

# Test Python environment
cd backend
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Test import
if python -c "import supabase; print('Supabase Python client imported successfully')" 2>/dev/null; then
    print_success "Python Supabase client working"
else
    print_error "Python Supabase client import failed"
fi

cd ..

# Test Node.js dependencies
if npm list @supabase/supabase-js &> /dev/null; then
    print_success "Frontend Supabase client installed"
else
    print_warning "Frontend Supabase client may not be properly installed"
fi

# Step 6: Provide next steps
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. 📊 Set up your Supabase database:"
echo "   - Go to https://app.supabase.com"
echo "   - Run the migrations from supabase/migrations/"
echo "   - Or follow the wiki guide: wiki/supabase-setup.md"
echo ""
echo "2. 🚀 Start the development servers:"
echo "   Frontend: npm run dev"
echo "   Backend:  cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo ""
echo "3. 🔧 Configure your environment:"
echo "   - Update .env with your specific configuration"
echo "   - Set up authentication providers in Supabase"
echo ""
echo "4. 📚 Read the documentation:"
echo "   - Check out wiki/README.md for comprehensive guides"
echo "   - Review CONTRIBUTING.md for development guidelines"
echo ""
echo "🔗 Useful Links:"
echo "   - Luna Services Wiki: wiki/README.md"
echo "   - Supabase Setup Guide: wiki/supabase-setup.md"
echo "   - Contributing Guide: CONTRIBUTING.md"
echo ""

print_success "Luna Services setup with Supabase is ready! 🚀"
