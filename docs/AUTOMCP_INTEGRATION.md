# Luna Services - AutoMCP Integration Guide

## 🎯 Overview

Luna Services Universal MCP System is now fully compatible with [AutoMCP by NapthaAI](https://github.com/napthaai/automcp). This integration allows you to easily deploy Luna's advanced AI development tools as MCP servers that can be accessed by standardized interfaces via clients like Cursor and Claude Desktop.

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Run the automated setup script
./scripts/setup-automcp.sh

# Update your API keys in .env file
nano .env

# Test the MCP server
python run_mcp.py
```

### Option 2: Manual Setup

```bash
# Install AutoMCP
pip install naptha-automcp

# The run_mcp.py file is already configured for you
# Update your environment variables
cp .env.example .env
nano .env  # Add your API keys

# Test the server
python run_mcp.py
```

## 🔧 Configuration

### Environment Variables

Update your `.env` file with the required API keys:

```env
# REQUIRED: Google Gemini API Key
GEMINI_API_KEY=your-google-gemini-api-key-here

# OPTIONAL: Additional AI Services
OPENAI_API_KEY=your-openai-api-key-here
RIVA_SERVER_URL=http://localhost:50051

# MCP Features
MCP_ENABLE_VOICE=true
MCP_ENABLE_MULTIMODAL=true
MCP_ENABLE_ANALYTICS=true
```

### Project Structure

Your project is now configured with:

```
Luna-Services/
├── run_mcp.py                 # AutoMCP-compatible server file
├── pyproject.toml            # AutoMCP build configuration
├── .cursor/mcp.json          # Cursor IDE integration
├── .env                      # Environment configuration
└── scripts/setup-automcp.sh  # Setup automation
```

## 🎮 Usage

### Running the MCP Server

```bash
# STDIO transport (default)
python run_mcp.py

# SSE transport
python run_mcp.py sse

# Using AutoMCP CLI
automcp serve -t stdio
automcp serve -t sse

# Using uv (if configured)
uv run serve_stdio
uv run serve_sse
```

### Available MCP Tools

Luna Services provides the following tools through the MCP interface:

#### `luna_mcp_processor`

A comprehensive AI development assistant that supports:

- **Code Generation**: Create code in 20+ programming languages
- **Debugging**: AI-powered error detection and resolution
- **Architecture Design**: System design and planning assistance
- **API Integration**: Automated API testing and integration
- **Documentation**: Auto-generated technical documentation
- **Voice Commands**: Voice-enabled development assistance
- **Multi-modal Input**: Text, voice, and image processing

#### Function Parameters:

- `task_type`: Type of task (code_generation, debugging, architecture_design, etc.)
- `prompt`: Your request or question
- `language`: Programming language (python, javascript, typescript, etc.)
- `context`: Additional context and parameters
- `include_tests`: Whether to include test generation
- `include_documentation`: Whether to include documentation

#### Example Usage:

```python
# Code generation example
result = await luna_mcp_processor(
    task_type="code_generation",
    prompt="Create a REST API endpoint for user authentication",
    language="python",
    context={"framework": "fastapi"},
    include_tests=True,
    include_documentation=True
)

# Debugging example  
result = await luna_mcp_processor(
    task_type="debugging",
    prompt="Fix this error in my code",
    language="javascript",
    context={
        "error_message": "TypeError: Cannot read property 'length' of undefined",
        "code_snippet": "const len = arr.length;"
    }
)

# Architecture design example
result = await luna_mcp_processor(
    task_type="architecture_design", 
    prompt="Design a microservices architecture for an e-commerce platform",
    context={
        "system_requirements": ["high availability", "scalability", "security"],
        "preferred_technologies": ["docker", "kubernetes", "postgresql"]
    }
)
```

## 🔌 Client Integration

### Cursor IDE

Update the paths in `.cursor/mcp.json` to match your system:

```json
{
    "mcpServers": {
        "luna-services": {
            "type": "stdio",
            "command": "uv",
            "args": [
                "--directory", 
                "/absolute/path/to/Luna-Services",
                "run",
                "serve_stdio"
            ],
            "env": {
                "GEMINI_API_KEY": "your-key-here"
            }
        }
    }
}
```

### Claude Desktop

Add to your Claude Desktop configuration:

```json
{
    "mcpServers": {
        "luna-services": {
            "command": "python",
            "args": ["/absolute/path/to/Luna-Services/run_mcp.py"],
            "env": {
                "GEMINI_API_KEY": "your-key-here"
            }
        }
    }
}
```

### Direct GitHub Execution

Use directly from GitHub without local installation:

```json
{
    "mcpServers": {
        "luna-services": {
            "command": "uvx",
            "args": [
                "--from",
                "git+https://github.com/Drago-03/Luna-Services",
                "serve_stdio"
            ],
            "env": {
                "GEMINI_API_KEY": "your-key-here"
            }
        }
    }
}
```

## ☁️ Naptha MCPaaS Deployment

### Prerequisites

1. Ensure your repository uses `uv` (already configured in `pyproject.toml`)
2. The `run_mcp.py` file is at the root (✅ already done)
3. Proper script configuration in `pyproject.toml` (✅ already done)

### Deployment Steps

1. **Test locally first:**
   ```bash
   uvx --from https://github.com/Drago-03/Luna-Services serve_sse
   ```

2. **Deploy to Naptha:**
   - Go to [labs.naptha.ai](https://labs.naptha.ai/)
   - Sign in with your GitHub account
   - Select the Luna-Services repository
   - Add your environment variables (GEMINI_API_KEY, etc.)
   - Click Launch
   - Copy the SSE URL for your MCP clients

### Environment Variables for MCPaaS

When deploying to Naptha's MCPaaS, configure these environment variables:

```
GEMINI_API_KEY=your-google-gemini-api-key
OPENAI_API_KEY=your-openai-api-key
MCP_ENABLE_VOICE=true
MCP_ENABLE_MULTIMODAL=true
MCP_ENABLE_ANALYTICS=true
```

## 🛠️ Development

### Adding New Tools

To add new MCP tools, modify `run_mcp.py`:

```python
# Add your new tool function
async def my_custom_tool(param1: str, param2: int) -> Dict[str, Any]:
    """Your custom MCP tool"""
    # Implementation here
    return {"result": "success"}

# Register it with FastMCP
mcp.add_tool(
    my_custom_tool,
    name="my_custom_tool",
    description="Description of what your tool does"
)
```

### Testing

```bash
# Test the MCP server
python run_mcp.py &
MCP_PID=$!

# Test with MCP inspector
npx @modelcontextprotocol/inspector

# Clean up
kill $MCP_PID
```

## 📊 Monitoring

The MCP server includes built-in analytics and monitoring:

- Request/response tracking
- Performance metrics
- Error logging
- Usage statistics

View analytics through the Luna Services dashboard or API endpoints.

## 🔍 Troubleshooting

### Common Issues

1. **Import Errors**
   ```bash
   # Install missing dependencies
   pip install naptha-automcp
   pip install -r backend/requirements.txt
   ```

2. **API Key Issues**
   ```bash
   # Verify your .env file
   cat .env | grep GEMINI_API_KEY
   ```

3. **Connection Issues**
   ```bash
   # Test server startup
   python run_mcp.py &
   sleep 3
   curl http://localhost:8000/health || echo "Server not responding"
   ```

4. **STDIO Protocol Corruption**
   - The server automatically suppresses warnings that could corrupt STDIO
   - If issues persist, check your Python dependencies

### Debug Commands

```bash
# Check MCP server status
python -c "import run_mcp; print('MCP server OK')"

# Test AutoMCP CLI
automcp serve -t sse --debug

# Test with verbose logging
PYTHONPATH=. python run_mcp.py sse
```

## 📚 Additional Resources

- [AutoMCP Documentation](https://github.com/napthaai/automcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Naptha MCPaaS](https://labs.naptha.ai/)
- [Luna Services Documentation](./docs/)

## 🤝 Support

For issues related to:
- **Luna Services**: Open an issue in this repository
- **AutoMCP**: Visit [AutoMCP GitHub](https://github.com/napthaai/automcp)
- **MCPaaS**: Contact Naptha support

---

**Note**: This integration maintains full compatibility with Luna Services' existing features while adding AutoMCP standardization for broader ecosystem integration.
