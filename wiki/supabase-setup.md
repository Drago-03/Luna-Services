# Supabase Database Setup Guide

This guide walks you through setting up Supabase for Luna Services, including database configuration, authentication, and security policies.

## 📋 Prerequisites

- Supabase account (free tier available)
- Git access to Luna Services repository
- Basic understanding of SQL and database concepts

## 🚀 Quick Setup

### Step 1: Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: Luna Services
   - **Database Password**: Use a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"

### Step 2: Get Credentials

Once your project is created, navigate to **Settings > API** and collect:

```env
# Required for Luna Services
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_DB_PASSWORD=your-database-password

# Database connection details
SUPABASE_DB_HOST=db.your-project-ref.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres

# JWT Configuration
SUPABASE_JWT_SECRET=your-jwt-secret
```

#### Option C: Direct PostgreSQL Connection
```bash
# Using psql (if you have it installed)
psql "postgresql://postgres.tnmsadjdeenhysllhyzp:JglPPLffmXPYaDzS@aws-0-ap-south-1.pooler.supabase.com:5432/postgres" -f supabase/migrations/20250129_000001_initial_schema.sql
psql "postgresql://postgres.tnmsadjdeenhysllhyzp:JglPPLffmXPYaDzS@aws-0-ap-south-1.pooler.supabase.com:5432/postgres" -f supabase/migrations/20250129_000002_rls_policies.sql
psql "postgresql://postgres.tnmsadjdeenhysllhyzp:JglPPLffmXPYaDzS@aws-0-ap-south-1.pooler.supabase.com:5432/postgres" -f supabase/migrations/20250129_000003_functions_triggers.sql
```

### 4. Start Development Servers

```bash
# Frontend (in root directory)
npm run dev

# Backend (in backend directory)
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

## 🔧 Manual Setup (Alternative)

If you prefer to set up manually:

### 1. Install Frontend Dependencies

```bash
npm install @supabase/supabase-js@^2.39.7
```

### 2. Install Backend Dependencies

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install "supabase==2.3.4"
pip install "postgrest>=0.10.8,<0.16.0"
pip install -r requirements.txt
```

### 3. Configure Environment

Create `.env` file and add the Supabase configuration.

### 4. Run Migrations

Follow the migration steps above.

## 🗄️ Database Schema

The database schema includes:

### Tables
- **users**: User profiles and authentication data
- **projects**: Project management data
- **project_members**: Project team membership
- **automation_jobs**: Automation workflow definitions
- **job_executions**: Automation execution history
- **api_keys**: API key management

### Features
- **Row Level Security (RLS)**: Fine-grained access control
- **Real-time subscriptions**: Live updates via Supabase
- **Automatic triggers**: User creation, statistics updates
- **Data validation**: Input validation and constraints

## 🔐 Security Features

### Authentication
- Supabase Auth integration
- JWT token-based authentication
- User roles and permissions
- API key management

### Data Protection
- Row Level Security policies
- Encrypted data transmission
- Secure database connections
- Input validation and sanitization

## 🧪 Testing the Setup

### 1. Test Frontend Connection

```typescript
// In your browser console or component
import { supabase } from './src/services/supabase'

// Test connection
const testConnection = async () => {
  const { data, error } = await supabase.auth.getSession()
  console.log('Connection test:', { data, error })
}

testConnection()
```

### 2. Test Backend Connection

```python
# In your Python environment
from backend.app.supabase_client import supabase_manager

# Test connection
async def test_connection():
    result = await supabase_manager.verify_connection()
    print(f"Connection test: {result}")

# Run the test
import asyncio
asyncio.run(test_connection())
```

### 3. Test Database Queries

```bash
# Test a simple query in the Supabase dashboard SQL editor
SELECT version();
SELECT * FROM auth.users LIMIT 1;
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Dependency Conflicts
```bash
# If you get postgrest version conflicts
pip uninstall postgrest supabase
pip install "supabase==2.3.4"
pip install "postgrest>=0.10.8,<0.16.0"
```

#### 2. Environment Variables Not Loading
- Ensure `.env` file is in the project root
- Restart your development servers after updating `.env`
- Check that environment variables are correctly formatted

#### 3. Database Connection Issues
- Verify the database URL is correct
- Check if your IP is allowed in Supabase settings
- Ensure the password is correctly URL-encoded

#### 4. Migration Errors
- Run migrations in the correct order
- Check for syntax errors in SQL
- Ensure you have sufficient database permissions

### Getting Help

If you encounter issues:

1. **Check the logs**: Look for error messages in browser console or terminal
2. **Verify credentials**: Ensure all Supabase credentials are correct
3. **Check documentation**: Review the Supabase documentation
4. **Create an issue**: Open a GitHub issue with detailed error information

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Luna Services Wiki](../wiki/README.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [Security Policy](../SECURITY.md)

## 🎯 Next Steps

After successful setup:

1. **Create your first user**: Sign up through the frontend
2. **Create a project**: Use the project management features
3. **Set up automation**: Create your first automation job
4. **Explore the API**: Test the backend endpoints
5. **Contribute**: Help improve the project!

---

*This setup guide is maintained by the Luna Services team. If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.*
