#!/bin/bash

# Luna Services Supabase Setup Script
# This script sets up the Supabase database integration

set -e

echo "🚀 Luna Services - Supabase Setup"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists "node"; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

if ! command_exists "python3"; then
    echo "❌ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi

if ! command_exists "pip3"; then
    echo "❌ pip3 is not installed. Please install pip for Python 3."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please update it with your actual configuration values."
else
    echo "ℹ️  .env file already exists"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Add Supabase to frontend if not already added
if ! grep -q "@supabase/supabase-js" package.json; then
    echo "📦 Adding Supabase to frontend dependencies..."
    npm install @supabase/supabase-js@^2.39.7
fi

echo "✅ Frontend dependencies installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🐍 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install requirements with fixed versions to avoid conflicts
echo "📦 Installing Python dependencies..."
pip install "supabase==2.3.4"
pip install "postgrest>=0.10.8,<0.16.0"
pip install -r requirements.txt

echo "✅ Backend dependencies installed"

# Go back to root directory
cd ..

# Install Supabase CLI if not present
if ! command_exists "supabase"; then
    echo "🔧 Installing Supabase CLI..."
    if command_exists "brew"; then
        brew install supabase/tap/supabase
    elif command_exists "npm"; then
        npm install -g supabase
    else
        echo "⚠️  Please install Supabase CLI manually from https://supabase.com/docs/guides/cli"
        echo "   You can also use npm: npm install -g supabase"
    fi
fi

# Check if Supabase is configured
if [ -f "supabase/config.toml" ]; then
    echo "✅ Supabase configuration found"
else
    echo "⚠️  Supabase configuration not found. Run 'supabase init' to initialize."
fi

# Function to run SQL migrations
run_migrations() {
    echo "🗄️  Setting up database migrations..."
    
    # Check if we can connect to Supabase
    if [ -n "$VITE_SUPABASE_URL" ] && [ -n "$SUPABASE_SERVICE_KEY" ]; then
        echo "ℹ️  To run migrations, use one of these methods:"
        echo "   1. Supabase Dashboard: Copy and paste the SQL from supabase/migrations/"
        echo "   2. Supabase CLI: supabase db push (if connected to project)"
        echo "   3. psql: Connect directly and run the migration files"
        
        echo ""
        echo "📁 Migration files are located in:"
        echo "   - supabase/migrations/20250129_000001_initial_schema.sql"
        echo "   - supabase/migrations/20250129_000002_rls_policies.sql"
        echo "   - supabase/migrations/20250129_000003_functions_triggers.sql"
    else
        echo "⚠️  Supabase environment variables not set. Please update .env file first."
    fi
}

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p uploads
mkdir -p backups

# Set up development scripts
echo "🔧 Setting up development scripts..."

# Make scripts executable
chmod +x scripts/*.sh 2>/dev/null || true
chmod +x dev.sh 2>/dev/null || true
chmod +x start.sh 2>/dev/null || true
chmod +x stop.sh 2>/dev/null || true

# Run migrations setup
run_migrations

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Update your .env file with actual Supabase credentials"
echo "2. Run the database migrations in your Supabase dashboard"
echo "3. Start the development servers:"
echo "   Frontend: npm run dev"
echo "   Backend:  cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Project overview"
echo "   - CONTRIBUTING.md - How to contribute"
echo "   - wiki/ - Comprehensive documentation"
echo ""
echo "🔗 Useful commands:"
echo "   npm run dev           # Start frontend development server"
echo "   npm run build         # Build for production"
echo "   npm run lint          # Run linting"
echo "   ./scripts/quick-setup.sh  # Quick project setup"
echo ""
echo "Need help? Check the wiki or create an issue on GitHub!"
echo ""
echo "Happy coding! 🚀"
