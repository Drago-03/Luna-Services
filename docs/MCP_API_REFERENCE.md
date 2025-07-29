# Universal MCP API Reference

## Overview

The Universal Model Context Protocol (MCP) API provides comprehensive AI-powered development assistance through RESTful endpoints. This API enables developers to leverage advanced AI models for code generation, debugging, architecture design, and more.

## Base URL

```
https://your-domain.com/api/mcp
```

## Authentication

All API endpoints require JWT authentication via the Authorization header:

```
Authorization: Bearer <jwt_token>
```

Obtain a JWT token through the `/api/auth/login` endpoint.

## Rate Limiting

- **Free Tier**: 100 requests per hour
- **Professional**: 1,000 requests per hour  
- **Enterprise**: 10,000 requests per hour

## Core Endpoints

### Sessions

#### Create Session
```http
POST /sessions
```

Create a new MCP session for contextual AI assistance.

**Request Body:**
```json
{
  "project_id": "optional-project-id",
  "session_name": "My Development Session"
}
```

**Response:**
```json
{
  "id": "session-uuid",
  "user_id": "user-id",
  "project_id": "project-id",
  "session_name": "My Development Session",
  "context_history": [],
  "active_files": [],
  "preferences": {},
  "created_at": "2024-01-01T00:00:00Z",
  "last_activity": "2024-01-01T00:00:00Z",
  "is_active": true
}
```

#### Get Session
```http
GET /sessions/{session_id}
```

**Response:** Session object (same as create response)

### Code Generation

#### Generate Code
```http
POST /generate
```

Generate code using AI based on natural language requirements.

**Request Body:**
```json
{
  "task_type": "code_generation",
  "prompt": "Create a function that sorts users by registration date",
  "language": "python",
  "context": {
    "include_tests": true,
    "include_documentation": true,
    "function_name": "sort_users_by_date",
    "requirements": ["Handle null dates", "Sort in descending order"]
  }
}
```

**Response:**
```json
{
  "request_id": "request-uuid",
  "status": "success",
  "generated_code": "def sort_users_by_date(users):\n    ...",
  "explanation": "This function sorts a list of users...",
  "suggestions": [
    "Consider adding type hints",
    "Add input validation"
  ],
  "confidence_score": 0.95,
  "execution_time": 2.3,
  "tokens_used": 150,
  "voice_output": "base64-encoded-audio"
}
```

### Debugging

#### Debug Code
```http
POST /debug
```

Get AI-powered debugging assistance for code issues.

**Request Body:**
```json
{
  "task_type": "debugging",
  "prompt": "Help me fix this error",
  "language": "python",
  "error_message": "TypeError: 'NoneType' object is not iterable",
  "stack_trace": "Traceback (most recent call last):\n  File...",
  "code_snippet": "def process_data(data):\n    for item in data:\n        ...",
  "runtime_environment": {
    "python_version": "3.11",
    "os": "linux"
  }
}
```

**Response:**
```json
{
  "request_id": "request-uuid", 
  "status": "success",
  "result": {
    "debug_analysis": "The error occurs because 'data' is None..."
  },
  "explanation": "Root cause analysis and solution...",
  "suggestions": [
    "Add null check before iteration",
    "Use defensive programming practices"
  ],
  "confidence_score": 0.88,
  "execution_time": 1.8
}
```

### Architecture Design

#### Design Architecture
```http
POST /architect
```

Get AI assistance for software architecture design.

**Request Body:**
```json
{
  "task_type": "architecture_design",
  "prompt": "Design a microservices architecture for an e-commerce platform",
  "system_requirements": [
    "Handle 1M+ users",
    "Real-time inventory",
    "Payment processing",
    "Order management"
  ],
  "constraints": [
    "Cloud-native",
    "Maximum 200ms response time"
  ],
  "preferred_technologies": [
    "Docker",
    "Kubernetes", 
    "PostgreSQL"
  ],
  "scale_requirements": {
    "concurrent_users": 10000,
    "transactions_per_second": 1000
  }
}
```

**Response:**
```json
{
  "request_id": "request-uuid",
  "status": "success", 
  "result": {
    "architecture_design": "Detailed architecture description..."
  },
  "explanation": "Complete architecture breakdown...",
  "suggestions": [
    "Consider event-driven architecture",
    "Implement circuit breakers",
    "Use Redis for caching"
  ]
}
```

### Voice Commands

#### Process Voice Command
```http
POST /voice
```

Process voice input for hands-free development assistance.

**Request Body:**
```json
{
  "task_type": "voice_command",
  "audio_data": "base64-encoded-audio-data",
  "expected_language": "en",
  "context_aware": true,
  "context": {
    "current_file": "app.py",
    "cursor_position": 42
  }
}
```

**Response:**
```json
{
  "request_id": "request-uuid",
  "status": "success",
  "result": {
    "transcription": "Create a new function called calculate average",
    "response": {
      "generated_code": "def calculate_average(numbers):\n    ...",
      "explanation": "Function to calculate average..."
    }
  },
  "voice_output": "base64-encoded-response-audio"
}
```

### File Analysis

#### Analyze Files
```http
POST /upload/analyze
```

Analyze uploaded files using AI for code review, documentation, or insights.

**Request:** Multipart form data with files

**Response:**
```json
{
  "request_id": "request-uuid",
  "status": "success",
  "result": {
    "analysis": "File analysis results...",
    "issues_found": 3,
    "suggestions": [
      "Add error handling in main.py",
      "Update outdated dependencies"
    ]
  }
}
```

### Analytics

#### Get User Analytics
```http
GET /analytics/user?days=30
```

Get usage analytics for the authenticated user.

**Response:**
```json
{
  "total_requests": 245,
  "successful_requests": 235,
  "success_rate": 0.96,
  "avg_execution_time": 2.1,
  "total_tokens_used": 45230,
  "task_type_breakdown": {
    "code_generation": 120,
    "debugging": 80,
    "architecture_design": 25,
    "voice_command": 15,
    "documentation": 5
  },
  "period_days": 30
}
```

### System Status

#### Get MCP Status
```http
GET /status
```

Get current system status and health information.

**Response:**
```json
{
  "status": "operational",
  "active_sessions": 156,
  "active_requests": 12,
  "features": {
    "voice_enabled": true,
    "multimodal_enabled": true,
    "analytics_enabled": true
  },
  "models": {
    "primary_llm": "gemini-2.5-flash",
    "voice_synthesis": "NVIDIA Riva TTS",
    "framework": "LangChain"
  },
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## WebSocket API

### Real-time Communication
```
WSS /ws/{session_id}
```

Establish WebSocket connection for real-time AI assistance.

**Message Format:**
```json
{
  "type": "request",
  "data": {
    "task_type": "code_generation",
    "prompt": "Create a REST API endpoint",
    "language": "python"
  }
}
```

**Response Format:**
```json
{
  "type": "response", 
  "request_id": "request-uuid",
  "data": {
    "status": "success",
    "generated_code": "...",
    "explanation": "..."
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input parameters |
| 401 | Unauthorized - Invalid or missing JWT token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource does not exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server-side error |
| 503 | Service Unavailable - AI model temporarily unavailable |

## Error Response Format

```json
{
  "error": {
    "code": 400,
    "message": "Invalid input parameters",
    "details": "The 'prompt' field is required",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

## SDKs and Libraries

### Python SDK
```python
from mcp_client import MCPClient

client = MCPClient(api_key="your-api-key")
response = client.generate_code(
    prompt="Create a sorting function",
    language="python"
)
```

### JavaScript SDK
```javascript
import { MCPClient } from '@mcp/client';

const client = new MCPClient({ apiKey: 'your-api-key' });
const response = await client.generateCode({
  prompt: 'Create a sorting function',
  language: 'javascript'
});
```

### CLI Tool
```bash
mcp generate "Create a REST API" --language python --output app.py
mcp debug --file buggy_code.py --error "TypeError"
mcp architect "Design microservices" --scale enterprise
```

## Rate Limiting Headers

All responses include rate limiting information:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Webhooks

Configure webhooks to receive notifications about long-running tasks:

```http
POST /webhooks
```

**Request:**
```json
{
  "url": "https://your-app.com/mcp-webhook",
  "events": ["task_completed", "task_failed"],
  "secret": "webhook-secret"
}
```

## Best Practices

1. **Context Management**: Use sessions to maintain context across requests
2. **Error Handling**: Always check response status and handle errors gracefully
3. **Rate Limiting**: Implement exponential backoff for rate limit handling
4. **Caching**: Cache responses when appropriate to reduce API calls
5. **Security**: Never expose API keys in client-side code

## Support

- **Documentation**: [https://docs.mcp.dev](https://docs.mcp.dev)
- **GitHub**: [https://github.com/your-org/mcp-api](https://github.com/your-org/mcp-api)
- **Support Email**: api-support@mcp.dev
