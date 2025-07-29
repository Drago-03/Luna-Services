# Luna-Services - Universal MCP System

> AI-Powered Development Assistant with Supabase Database Integration

Luna-Services is a comprehensive Universal Model Context Protocol (MCP) system that provides intelligent development assistance powered by Google Gemini AI, Supabase database backend, and multi-modal processing. Built for modern development teams seeking AI-enhanced productivity with enterprise-grade data management.

## 🚀 Features

- **Universal MCP Integration**: Complete Model Context Protocol implementation with Google Gemini 2.0 Flash
- **Supabase Backend**: Modern PostgreSQL database with real-time capabilities and Row Level Security
- **Voice-Enabled Development**: Natural language voice commands for code generation and assistance
- **Multi-Modal Processing**: Handle text, code, voice, and file inputs seamlessly
- **Real-time Code Generation**: AI-powered code assistance with context awareness
- **Clerk + Supabase Authentication**: Dual authentication system with secure user management
- **Intelligent Dashboard**: Real-time activity tracking and project insights
- **Enterprise Ready**: Scalable architecture with Docker support and monitoring

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Chakra UI + Vite
- **Backend**: FastAPI + Python 3.11+ + Universal MCP Protocol
- **Database**: Supabase (PostgreSQL) + Redis for caching
- **AI Integration**: Google Gemini 2.0 Flash + LangChain + Voice Processing
- **Authentication**: Clerk Authentication + Supabase Auth with tier-based access
- **Containerization**: Docker + Docker Compose with NVIDIA GPU support
- **Voice Processing**: NVIDIA Riva (optional) for advanced TTS/ASR

## 🗄️ Database Integration

Luna Services uses **Supabase** as its primary database backend, providing:

- **PostgreSQL Database**: Robust relational database with JSON support
- **Real-time Subscriptions**: Live updates for collaborative features
- **Row Level Security**: Fine-grained access control at the database level
- **Auto-generated APIs**: RESTful and GraphQL APIs for database operations
- **Authentication**: Built-in user management and session handling
- **Storage**: File and media storage capabilities

### Database Schema

| Table | Purpose | Features |
|-------|---------|----------|
| `users` | User profiles and metadata | Extends Supabase auth.users |
| `projects` | Project management | JSONB settings, status tracking |
| `project_members` | Team membership | Role-based access control |
| `automation_jobs` | Automation workflows | Scheduling, parameters |
| `job_executions` | Execution history | Logs, status, performance |
| `api_keys` | API access management | Scoped permissions |

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (Required for frontend)
- **Python 3.9+** (Required for backend)
- **Supabase Account** (Free tier available)
- **Docker & Docker Compose** (Recommended for full deployment)
- **Git** (For version control)

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/Drago-03/Luna-Services.git
cd Luna-Services

# Run the comprehensive setup script
./scripts/setup-supabase-complete.sh
```

This script will:
- ✅ Install all frontend and backend dependencies
- ✅ Resolve Python dependency conflicts
- ✅ Set up environment variables with Supabase configuration
- ✅ Create Python virtual environment
- ✅ Test the installation
- ✅ Provide next steps and documentation links

### Option 2: Manual Setup

#### 1. Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

#### 2. Configure Environment

```bash
# Copy and edit environment file
cp .env.example .env
# Edit .env with your Supabase credentials
```

#### 3. Set Up Supabase Database

1. Create a Supabase project at [app.supabase.com](https://app.supabase.com)
2. Get your project credentials
3. Run database migrations from `supabase/migrations/`
4. Configure Row Level Security policies

📚 **Detailed Setup Guide**: [wiki/supabase-setup.md](wiki/supabase-setup.md)

### Option 3: Docker Deployment

```bash
# Start with Docker Compose
docker-compose up -d

# Or use the start script with Docker
./start.sh --docker
```
- ✅ Set up environment configuration
- ✅ Run health checks
- ✅ Display all access URLs

### Option 2: Docker Deployment

```bash
# Start with Docker Compose
./start.sh --docker

# Or use production mode
./start.sh --production --docker
```

### Option 3: Selective Startup

```bash
# Start only backend
./start.sh --backend-only

# Start only frontend  
./start.sh --frontend-only

# Start in production mode
./start.sh --production
```

## 📱 Access Points

After successful setup, access the system at:

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **MCP Dashboard**: http://localhost:8000/api/mcp
- **Health Check**: http://localhost:8000/health

## 🧪 Testing Your Setup

### Verify Database Connection

```bash
# Test Supabase connection
python scripts/test-supabase.py

# Expected output:
# ✅ All required environment variables are set
# ✅ Supabase client created successfully
# ✅ Database connection successful
# 🎉 All tests passed! Supabase is properly configured.
```

### Test API Endpoints

```bash
# Test backend health
curl http://localhost:8000/health

# Test authentication endpoint
curl http://localhost:8000/api/auth/status
```

### Verify Frontend

1. Open http://localhost:3000 in your browser
2. You should see the Luna Services dashboard
3. Authentication should work with Clerk/Supabase integration

## 🛠️ Development Workflow

### Daily Development

```bash
# 1. Check service status
./dev.sh status

# 2. Start services if needed
./start.sh

# 3. Monitor logs
./dev.sh logs --follow

# 4. Test database after changes
python scripts/test-supabase.py

# 5. Restart services after code changes
./dev.sh restart --frontend
./dev.sh restart --backend

# 6. Clean shutdown
./stop.sh
```

### Environment Management

```bash
# Update environment variables
cp .env .env.backup
# Edit .env with new values
./dev.sh restart  # Apply changes

# Switch between environments
cp .env.development .env  # Development
cp .env.production .env   # Production
```

## 📊 Database Operations

### Migrations

```bash
# Apply new migrations (Supabase Dashboard)
# 1. Go to SQL Editor in Supabase Dashboard
# 2. Run migration files in order from supabase/migrations/

# Check migration status
supabase db diff --local  # If using Supabase CLI
```

### Backup and Restore

```bash
# Backup (through Supabase Dashboard)
# Go to Settings > Database > Backups

# Local backup using CLI
supabase db dump > backup.sql

# Restore from backup
supabase db reset --db-url "your-backup-url"
```

### Monitoring

```bash
# View database logs
# Go to Supabase Dashboard > Logs

# Monitor performance
# Go to Supabase Dashboard > Reports

# Check RLS policies
# Go to Supabase Dashboard > Authentication > Policies
```

## � Documentation

### Core Documentation
- **[Wiki Homepage](wiki/README.md)** - Comprehensive documentation hub
- **[Supabase Setup Guide](wiki/supabase-setup.md)** - Complete database setup
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project
- **[API Reference](docs/MCP_API_REFERENCE.md)** - Complete API documentation

### Quick Start Guides
- **[Installation Guide](wiki/installation.md)** - Step-by-step installation
- **[Configuration Guide](wiki/configuration.md)** - Environment setup
- **[First Project](wiki/first-project.md)** - Create your first project
- **[Development Setup](wiki/development.md)** - Local development environment

### Deployment
- **[Docker Deployment](wiki/docker-deployment.md)** - Container deployment
- **[Production Setup](wiki/production.md)** - Production configuration
- **[Monitoring](wiki/monitoring.md)** - Application monitoring
- **[Security Guide](wiki/security.md)** - Security best practices

### Legal and Policies
- **[Privacy Policy](PRIVACY_POLICY.md)** - How we handle your data
- **[Terms of Service](TERMS_OF_SERVICE.md)** - Terms and conditions
- **[Cookie Policy](COOKIE_POLICY.md)** - Cookie usage policy
- **[Security Policy](SECURITY.md)** - Security guidelines and reporting

## �🔧 Development

### Frontend Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### Backend Development

```bash
# Set up Python environment
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start development server
uvicorn app.main:app --reload

# Run tests
pytest

# Lint code
flake8
```

### Database Development

```bash
# Test database connection
python scripts/test-supabase.py

# Access Supabase dashboard
# Go to https://app.supabase.com

# View database schema
# Supabase Dashboard > Database > Tables

# Monitor real-time data
# Supabase Dashboard > Database > Replication
```

## 🚀 Production Deployment

### Docker Production

```bash
# Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f
```

### Environment Variables for Production

```env
# Production Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_KEY=your-production-service-key

# Security Settings
JWT_SECRET_KEY=your-production-jwt-secret
CORS_ORIGINS=["https://yourdomain.com"]
ENVIRONMENT=production
DEBUG=false

# Database Connection (use pooler for production)
DATABASE_URL=postgresql://postgres.project:password@pooler.supabase.com:6543/postgres
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and ensure tests pass
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting
- Follow the [Contributing Guide](CONTRIBUTING.md)

## 📊 Project Status

- **Version**: 1.0.0 (Development)
- **Status**: ✅ Active Development
- **Database**: ✅ Supabase Integrated
- **Authentication**: ✅ Clerk + Supabase Auth
- **Frontend**: ✅ React + TypeScript
- **Backend**: ✅ FastAPI + Python
- **Documentation**: ✅ Comprehensive Wiki

### Recent Updates

- ✅ Supabase database integration complete
- ✅ Row Level Security policies implemented
- ✅ Authentication system working
- ✅ Real-time features enabled
- ✅ Comprehensive documentation added
- ✅ Setup automation scripts created

## 🔒 Security

Luna Services takes security seriously:

- **Row Level Security**: Database-level access control
- **Authentication**: Multi-provider authentication system
- **Encryption**: Data encrypted in transit and at rest
- **CORS Protection**: Configurable cross-origin request protection
- **Rate Limiting**: API rate limiting and abuse prevention
- **Security Headers**: Comprehensive security headers implemented

Report security issues to: security@luna-services.dev

## 📞 Support

### Community Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Drago-03/Luna-Services/issues)
- **Discussions**: [Community Q&A and discussions](https://github.com/Drago-03/Luna-Services/discussions)
- **Wiki**: [Comprehensive documentation](wiki/README.md)

### Direct Support

- **Email**: support@luna-services.dev
- **Response Time**: 24-48 hours for non-urgent issues
- **Enterprise Support**: Available for production deployments

### Getting Help

1. **Check the [Wiki](wiki/README.md)** for comprehensive guides
2. **Search [Issues](https://github.com/Drago-03/Luna-Services/issues)** for existing solutions
3. **Join [Discussions](https://github.com/Drago-03/Luna-Services/discussions)** for community help
4. **Create a new issue** if you can't find a solution

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - For providing an excellent backend-as-a-service platform
- **Google Gemini** - For AI capabilities and natural language processing
- **Clerk** - For seamless authentication and user management
- **FastAPI** - For the high-performance Python web framework
- **React Team** - For the excellent frontend framework
- **Open Source Community** - For the amazing tools and libraries

---

**Made with ❤️ by the Luna Services Team**

For more information, visit our [comprehensive documentation](wiki/README.md) or check out the [contributing guide](CONTRIBUTING.md) to get involved!

**Last Updated**: January 29, 2025  
**Version**: 1.0.0

### Backend Development

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Running Tests

```bash
# Frontend tests
npm test

# Backend tests
cd backend
pytest
```

## 🐳 Production Deployment

### Docker Compose (Recommended)

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# With SSL certificates
docker-compose -f docker-compose.prod.yml -f docker-compose.ssl.yml up -d
```

### Kubernetes

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/
```

## 🔒 Security

Luna-service implements enterprise-grade security:

- JWT-based authentication
- Role-based access control (RBAC)
- API rate limiting
- Data encryption at rest and in transit
- Comprehensive audit logging
- Security headers and CORS protection

## 🔗 Integrations

### GitHub Integration

```yaml
integrations:
  github:
    enabled: true
    webhook_url: "https://your-domain.com/api/webhooks/github"
    repository: "your-org/your-repo"
```

### Slack Notifications

```yaml
integrations:
  slack:
    enabled: true
    webhook_url: "https://hooks.slack.com/services/..."
    channel: "#luna-notifications"
```

### Jira Integration

```yaml
integrations:
  jira:
    enabled: true
    server_url: "https://your-org.atlassian.net"
    project_key: "LUNA"
```

## 📊 Monitoring

Luna-service includes comprehensive monitoring:

- Prometheus metrics endpoint: `/api/metrics`
- Health check endpoint: `/health`
- Structured logging with request tracing
- Performance monitoring and alerting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](https://docs.luna-service.com)
- 🐛 [Issue Tracker](https://github.com/your-org/luna-service/issues)
- 💬 [Discussions](https://github.com/your-org/luna-service/discussions)
- 📧 [Email Support](mailto:support@luna-service.com)

## 🏆 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- UI powered by [Chakra UI](https://chakra-ui.com/)
- Documentation with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/)