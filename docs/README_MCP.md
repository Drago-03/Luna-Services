# Universal Model Context Protocol (MCP) System

A comprehensive, enterprise-grade Universal Model Context Protocol system specifically designed for AI developers, featuring Google Gemini 2.5 integration, LangChain orchestration, NVIDIA Riva voice capabilities, and a complete web platform for AI-assisted development.

## 🌟 Features

### Core AI Capabilities
- **Google Gemini 2.5 Flash Integration** - Advanced language model with specialized development prompts
- **LangChain Orchestration** - Complex workflow management for AI development tasks
- **NVIDIA Riva TTS/ASR** - Voice synthesis and speech recognition for hands-free development
- **Multi-Modal Support** - Text, code, image, and voice input processing
- **Real-time Streaming** - Live AI responses and conversation management

### Development Tools
- **Intelligent Code Generation** - Context-aware code creation and modification
- **Advanced Debugging** - AI-powered error detection and resolution
- **Architecture Planning** - System design and architecture recommendations
- **Documentation Generation** - Automated technical documentation creation
- **Code Analysis** - Performance optimization and best practices enforcement

### Platform Features
- **User Authentication & Authorization** - Secure JWT-based authentication system
- **Project Management** - Comprehensive project organization and tracking
- **Session Management** - Persistent conversation history and context
- **File Upload & Processing** - Multi-format file support for code analysis
- **Analytics & Monitoring** - Usage tracking and performance metrics
- **Voice-Enabled Interface** - Hands-free development assistance

### Enterprise Features
- **Tiered Access Control** - Free, Pro, and Enterprise tiers
- **API Rate Limiting** - Configurable usage limits and throttling
- **Health Monitoring** - Comprehensive system health checks
- **Scalable Architecture** - Docker-based microservices architecture
- **Monitoring & Alerting** - Prometheus and Grafana integration

## 🚀 Quick Start

### Option 1: Quick Setup (Recommended for Development)

```bash
# Clone the repository
git clone <repository-url>
cd Luna-Services

# Run quick setup
./quick-setup.sh
```

### Option 2: Manual Setup

```bash
# 1. Copy environment configuration
cp .env.example .env

# 2. Edit .env with your API keys (especially GEMINI_API_KEY)
nano .env

# 3. Start services
docker-compose -f docker-compose.mcp.yml up -d

# 4. Wait for services to start and access at http://localhost:3000
```

### Option 3: Full Deployment Script

```bash
# Run comprehensive deployment
./scripts/deploy-mcp.sh development
```

## 🔧 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Chakra UI** for modern component library
- **Vite** for fast development and building
- **React Router** for navigation
- **Axios** for API communication

### Backend
- **FastAPI** with Python 3.11+
- **SQLAlchemy** ORM with PostgreSQL
- **JWT Authentication** with bcrypt hashing
- **Celery** for background task processing
- **Redis** for caching and session storage

### AI Services
- **Google Gemini 2.5 Flash** - Primary language model
- **LangChain** - Workflow orchestration framework
- **NVIDIA Riva** - Voice processing services
- **ChromaDB** - Vector database for embeddings

### Infrastructure
- **Docker & Docker Compose** for containerization
- **NGINX** for load balancing and reverse proxy
- **PostgreSQL** for primary data storage
- **Redis** for caching and real-time features
- **Prometheus & Grafana** for monitoring

## 📊 Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Frontend│    │   FastAPI Backend│    │  AI Services    │
│                 │    │                  │    │                 │
│ • Dashboard     │    │ • REST API       │    │ • Gemini 2.5    │
│ • Voice UI      │◄──►│ • WebSocket      │◄──►│ • LangChain     │
│ • File Upload   │    │ • Authentication │    │ • NVIDIA Riva   │
│ • Real-time     │    │ • Session Mgmt   │    │ • Vector DB     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌─────────────────────────────────────────────┐
         │              Infrastructure                │
         │                                           │
         │ • PostgreSQL (Data)                       │
         │ • Redis (Cache/Sessions)                  │
         │ • NGINX (Load Balancer)                   │
         │ • Prometheus/Grafana (Monitoring)         │
         └─────────────────────────────────────────────┘
```

## 🔑 Configuration

### Required Environment Variables

```bash
# Core API Keys
GEMINI_API_KEY=your_gemini_api_key_here

# Database
POSTGRES_PASSWORD=your_secure_password
DATABASE_URL=postgresql://postgres:password@localhost:5432/luna_mcp

# Security
JWT_SECRET_KEY=your-super-secret-jwt-key

# Optional Services
RIVA_API_KEY=your_riva_api_key_here_optional
```

### Service Configuration

The system uses the following ports by default:
- **Frontend**: 3000
- **Backend API**: 8000
- **PostgreSQL**: 5432
- **Redis**: 6379
- **Prometheus**: 9090
- **Grafana**: 3001

## 📚 API Documentation

### Core Endpoints

- `GET /api/mcp/health` - System health check
- `POST /api/auth/login` - User authentication
- `POST /api/mcp/chat` - AI conversation endpoint
- `POST /api/mcp/upload` - File upload for analysis
- `GET /api/mcp/sessions` - User session management

### WebSocket Endpoints

- `/ws/mcp/{session_id}` - Real-time AI conversation
- `/ws/voice/{session_id}` - Voice interaction stream

## 🎯 Usage Examples

### Basic AI Conversation

```python
import requests

response = requests.post("http://localhost:8000/api/mcp/chat", 
    json={
        "message": "Help me debug this Python function",
        "context": {"language": "python", "task_type": "debugging"},
        "files": [{"name": "example.py", "content": "def example(): pass"}]
    },
    headers={"Authorization": "Bearer your_jwt_token"}
)
```

### Voice Interaction

```javascript
// Frontend voice recording
const startVoiceRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Process audio stream with backend
};
```

## 🚀 Development

### Local Development Setup

```bash
# Frontend development
npm install
npm run dev

# Backend development
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Database setup
docker run -d --name postgres -e POSTGRES_PASSWORD=postgres123 -p 5432:5432 postgres:15
```

### Testing

```bash
# Run backend tests
cd backend
pytest

# Run frontend tests
npm test

# Integration tests
./scripts/run-tests.sh
```

## 📈 Monitoring & Analytics

### Access Monitoring Tools

- **Grafana Dashboard**: http://localhost:3001 (admin/admin)
- **Prometheus Metrics**: http://localhost:9090
- **Application Metrics**: http://localhost:8000/metrics

### Key Metrics Tracked

- Request/response times
- AI service usage and performance
- User session analytics
- System resource utilization
- Error rates and debugging

## 🔒 Security Features

- JWT-based authentication with secure token management
- Input validation and sanitization
- Rate limiting and DDoS protection
- Secure file upload with type validation
- API key encryption and secure storage

## 💰 Monetization Model

### Tier Structure

- **Free Tier**: 100 requests/month, basic features
- **Pro Tier**: $29/month, 5,000 requests, advanced features
- **Enterprise Tier**: Custom pricing, unlimited usage, priority support

### Revenue Streams

- Subscription-based pricing
- API usage-based billing
- Enterprise license sales
- Professional services and consulting

## 🛠️ Troubleshooting

### Common Issues

1. **API Key Not Working**
   ```bash
   # Verify your Gemini API key
   curl -H "Authorization: Bearer YOUR_API_KEY" https://generativelanguage.googleapis.com/v1beta/models
   ```

2. **Services Not Starting**
   ```bash
   # Check Docker logs
   docker-compose -f docker-compose.mcp.yml logs -f
   ```

3. **Database Connection Issues**
   ```bash
   # Reset database
   docker-compose -f docker-compose.mcp.yml down -v
   docker-compose -f docker-compose.mcp.yml up -d
   ```

### Getting Help

- Check the [Implementation Roadmap](docs/IMPLEMENTATION_ROADMAP.md)
- Review [API Reference](docs/MCP_API_REFERENCE.md)
- Examine Docker logs for specific services
- Verify environment variable configuration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support, email support@luna-mcp.com or create an issue in the repository.

---

Built with ❤️ for the AI development community
