# Universal Model Context Protocol (MCP) Implementation Guide

## 🚀 Overview

This document provides step-by-step instructions for implementing and deploying the Universal Model Context Protocol system built on top of Luna-Services. The MCP system integrates Google Gemini 2.5, LangChain, NVIDIA Riva TTS, and other cutting-edge AI technologies.

## 📋 Prerequisites

### System Requirements
- **Operating System**: Linux (Ubuntu 20.04+), macOS (10.15+), or Windows 10+
- **Memory**: Minimum 8GB RAM (16GB recommended)
- **Storage**: 50GB free space
- **Network**: Reliable internet connection for API access

### Software Dependencies
- **Docker & Docker Compose**: Latest stable versions
- **Node.js**: 18.x or higher
- **Python**: 3.11 or higher
- **Git**: Latest version

### API Keys and Services
- **Google Cloud Platform**: Gemini API access
- **NVIDIA Riva**: TTS service access (optional)
- **PostgreSQL**: Database service
- **Redis**: Caching and task queue

## 🔧 Installation Steps

### Step 1: Environment Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-org/luna-services.git
   cd luna-services
   ```

2. **Set Environment Variables**
   Create a `.env` file in the project root:
   ```env
   # Core API Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   DATABASE_URL=postgresql://luna_user:luna_password@postgres:5432/luna_db
   REDIS_URL=redis://redis:6379/0

   # Google Gemini Configuration
   GEMINI_API_KEY=your-google-gemini-api-key
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
   ```

### Step 2: Obtain API Keys

#### Google Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

#### NVIDIA Riva (Optional for Voice Features)
1. Register at [NVIDIA NGC](https://ngc.nvidia.com/)
2. Download Riva QuickStart scripts
3. Set up local Riva server or use cloud endpoint

### Step 3: Backend Setup

1. **Install Python Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Database Migration**
   ```bash
   alembic upgrade head
   ```

3. **Test Backend**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Step 4: Frontend Setup

1. **Install Node Dependencies**
   ```bash
   npm install
   ```

2. **Build Frontend**
   ```bash
   npm run build
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

### Step 5: Docker Deployment

1. **Build and Start Services**
   ```bash
   docker-compose up -d
   ```

2. **Verify Services**
   ```bash
   docker-compose ps
   ```

   Expected output:
   ```
   NAME                COMMAND             STATUS
   luna-frontend       nginx -g daemon...  Up
   luna-backend        uvicorn app.main... Up
   luna-postgres       docker-entrypoint... Up
   luna-redis          redis-server        Up
   luna-celery-worker  celery -A app.cel... Up
   ```

## 🧪 Testing the Installation

### 1. Health Check
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "services": {
    "api": "healthy",
    "database": "healthy",
    "redis": "healthy",
    "celery": "healthy"
  }
}
```

### 2. MCP Status Check
```bash
curl http://localhost:8000/api/mcp/status
```

### 3. Frontend Access
Open browser to `http://localhost:3000` and verify:
- Login page loads
- MCP dashboard is accessible
- All navigation links work

### 4. Code Generation Test
```bash
curl -X POST http://localhost:8000/api/mcp/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "task_type": "code_generation",
    "prompt": "Create a Python function to calculate fibonacci numbers",
    "language": "python"
  }'
```

## 🔐 Security Configuration

### 1. API Security
- Enable HTTPS in production
- Configure CORS properly
- Implement rate limiting
- Use secure JWT secrets

### 2. Database Security
- Use strong passwords
- Enable SSL connections
- Restrict network access
- Regular backups

### 3. AI Model Security
- Secure API key storage
- Input validation and sanitization
- Output filtering
- Usage monitoring

## 📊 Monitoring and Analytics

### 1. Application Metrics
- Response times
- Request volumes
- Error rates
- Resource utilization

### 2. AI Model Metrics
- Token usage
- Generation success rates
- Model latency
- Cost tracking

### 3. User Analytics
- Feature adoption
- Session duration
- Task completion rates
- User satisfaction

## 🔄 Maintenance and Updates

### Regular Tasks
1. **Daily**: Monitor system health and logs
2. **Weekly**: Review analytics and usage patterns
3. **Monthly**: Update dependencies and security patches
4. **Quarterly**: Performance optimization and feature updates

### Backup Strategy
1. **Database**: Daily automated backups
2. **Configuration**: Version controlled in Git
3. **User Data**: Encrypted backups with retention policy
4. **Logs**: Centralized logging with rotation

## 🚨 Troubleshooting

### Common Issues

#### 1. Gemini API Errors
**Problem**: `401 Unauthorized` or `403 Forbidden`
**Solution**: 
- Verify API key is correct
- Check API quotas and billing
- Ensure proper permissions

#### 2. Database Connection Issues
**Problem**: `Connection refused` or timeout errors
**Solution**:
- Check database service status
- Verify connection string
- Ensure network connectivity

#### 3. Memory Issues
**Problem**: Out of memory errors
**Solution**:
- Increase Docker memory limits
- Optimize model parameters
- Implement request queuing

#### 4. Voice Features Not Working
**Problem**: Voice synthesis fails
**Solution**:
- Check Riva server status
- Verify audio codec support
- Test with different voice models

### Debug Commands

```bash
# Check service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Database connection test
docker-compose exec postgres psql -U luna_user -d luna_db -c "SELECT 1;"

# Redis connection test
docker-compose exec redis redis-cli ping

# MCP service test
curl -v http://localhost:8000/api/mcp/status

# View running processes
docker-compose top
```

## 📈 Scaling for Production

### Horizontal Scaling
1. **Load Balancer**: NGINX or HAProxy
2. **Multiple Backend Instances**: Docker Swarm or Kubernetes
3. **Database Read Replicas**: PostgreSQL streaming replication
4. **Redis Cluster**: Multi-node Redis setup

### Performance Optimization
1. **Caching Strategy**: Redis for API responses
2. **CDN**: Static asset delivery
3. **Database Optimization**: Query optimization and indexing
4. **Model Caching**: Pre-load frequently used models

### Monitoring Stack
1. **Prometheus**: Metrics collection
2. **Grafana**: Visualization dashboards
3. **ELK Stack**: Centralized logging
4. **Alertmanager**: Alert notifications

## 🎯 Next Steps

### Phase 1: Core Functionality (Weeks 1-2)
- [ ] Complete MCP backend implementation
- [ ] Test all AI model integrations
- [ ] Implement basic frontend components
- [ ] Set up monitoring and logging

### Phase 2: Advanced Features (Weeks 3-4)
- [ ] Voice command processing
- [ ] Multi-modal input support
- [ ] Advanced code generation
- [ ] Architecture design tools

### Phase 3: Platform Features (Weeks 5-6)
- [ ] User management and authentication
- [ ] Project collaboration tools
- [ ] API documentation and testing
- [ ] Integration marketplace

### Phase 4: Production Deployment (Weeks 7-8)
- [ ] Security hardening
- [ ] Performance optimization
- [ ] CI/CD pipeline setup
- [ ] Production monitoring

## 📞 Support and Resources

### Documentation
- [API Reference](./API_REFERENCE.md)
- [User Guide](./USER_GUIDE.md)
- [Development Guide](./DEVELOPMENT.md)
- [Deployment Guide](./DEPLOYMENT.md)

### Community
- GitHub Issues: Bug reports and feature requests
- Discord Channel: Real-time community support
- Stack Overflow: Technical questions
- Documentation Wiki: Community-driven docs

### Commercial Support
- Priority support tickets
- Custom integration assistance
- Training and onboarding
- SLA-backed uptime guarantees

---

**Note**: This implementation guide is continuously updated. Please check for the latest version before deployment.
