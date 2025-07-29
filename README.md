# Luna-Services - Universal MCP System

> AI-Powered Development Assistant with Voice & Multi-Modal Capabilities

Luna-Services is a comprehensive Universal Model Context Protocol (MCP) system that provides intelligent development assistance powered by Google Gemini AI, voice interaction capabilities, and multi-modal processing. Built for modern development teams seeking AI-enhanced productivity.

## 🚀 Features

- **Universal MCP Integration**: Complete Model Context Protocol implementation with Google Gemini 2.0 Flash
- **Voice-Enabled Development**: Natural language voice commands for code generation and assistance
- **Multi-Modal Processing**: Handle text, code, voice, and file inputs seamlessly
- **Real-time Code Generation**: AI-powered code assistance with context awareness
- **Clerk Authentication**: Secure user management with tier-based access (Free, Pro, Enterprise)
- **Intelligent Dashboard**: Real-time activity tracking and project insights
- **Enterprise Ready**: Scalable architecture with Docker support and monitoring

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Chakra UI + Vite
- **Backend**: FastAPI + Python 3.11+ + Universal MCP Protocol
- **AI Integration**: Google Gemini 2.0 Flash + LangChain + Voice Processing
- **Authentication**: Clerk Authentication with tier-based access
- **Database**: PostgreSQL + Redis for caching
- **Containerization**: Docker + Docker Compose with NVIDIA GPU support
- **Voice Processing**: NVIDIA Riva (optional) for advanced TTS/ASR

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (Required for frontend)
- **Python 3.9+** (Required for backend)
- **Docker & Docker Compose** (Recommended for full deployment)
- **Git** (For version control)

### Option 1: One-Command Startup (Recommended)

```bash
# Clone the repository
git clone https://github.com/Drago-03/Luna-Services.git
cd Luna-Services

# Start both backend and frontend with one command
./start.sh
```

This will:
- ✅ Check all prerequisites
- ✅ Install dependencies automatically
- ✅ Start both backend (FastAPI) and frontend (React/Vite)
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

After startup, access the system at:

- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **MCP Dashboard**: http://localhost:8000/api/mcp
- **Health Check**: http://localhost:8000/health

## 🛠️ Development Scripts

### Primary Scripts

```bash
# Start the system (installs deps if needed)
./start.sh                    # Start both frontend and backend
npm run start                 # Alternative using npm

# Stop all services gracefully
./stop.sh                     # Graceful shutdown
./stop.sh --force            # Force kill all processes

# Development utilities
./dev.sh status              # Check service status
./dev.sh logs --follow       # Watch logs in real-time
./dev.sh health              # Run comprehensive health checks
```

### Advanced Usage

```bash
# Package.json scripts (npm/yarn)
npm run start:frontend       # Frontend only
npm run start:backend        # Backend only  
npm run start:production     # Production build
npm run start:docker         # Docker mode

npm run stop                 # Stop services
npm run status               # Service status
npm run logs:backend         # Backend logs
npm run restart:frontend     # Restart frontend only

# Direct script usage
./start.sh --install-deps    # Force reinstall dependencies
./start.sh --docker         # Use Docker Compose
./dev.sh update-deps        # Update all dependencies
./dev.sh clean              # Clean build artifacts
```

### Development Workflow

```bash
# Daily development routine
./dev.sh status              # Check what's running
./start.sh                   # Start if needed
./dev.sh logs --backend      # Monitor backend logs
./dev.sh restart --frontend # Restart frontend after changes
./stop.sh                   # Clean shutdown at end of day
```
   - Documentation: http://localhost:8080

### Demo Credentials

- **Email**: admin@luna-service.com
- **Password**: admin123

## 📖 Documentation

- [Getting Started](docs/getting-started/installation.md)
- [User Guide](docs/user-guide/dashboard.md)
- [API Reference](docs/api/auth.md)
- [Deployment Guide](docs/deployment/docker.md)

## 🔧 Development

### Frontend Development

```bash
npm install
npm run dev
```

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