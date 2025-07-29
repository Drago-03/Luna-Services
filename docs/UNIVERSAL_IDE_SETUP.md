# Universal IDE Setup Guide for Luna Services MCP

This guide provides comprehensive instructions for setting up Luna Services MCP server across different IDEs and platforms, ensuring compatibility with Mac, Windows, Linux, and all popular development environments.

## Overview

Luna Services is now **AutoMCP-compatible** and supports universal IDE integration with:
- ✅ **Local Development**: Direct STDIO execution
- ✅ **VSCode/Cursor**: Native MCP integration
- ✅ **GitHub Integration**: Direct repository execution
- ✅ **Cloud Deployment**: Naptha MCPaaS support
- ✅ **Universal Package Manager**: UV compatibility
- ✅ **Cross-Platform**: Mac, Windows, Linux support

## Platform-Specific Setup

### macOS Setup

1. **Install UV Package Manager**:
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. **Clone and Setup**:
   ```bash
   git clone https://github.com/YourUsername/Luna-Services.git
   cd Luna-Services
   uv sync
   ```

3. **Test MCP Server**:
   ```bash
   uv run python run_mcp.py
   ```

### Windows Setup

1. **Install UV Package Manager**:
   ```powershell
   powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```

2. **Clone and Setup**:
   ```cmd
   git clone https://github.com/YourUsername/Luna-Services.git
   cd Luna-Services
   uv sync
   ```

3. **Test MCP Server**:
   ```cmd
   uv run python run_mcp.py
   ```

### Linux Setup

1. **Install UV Package Manager**:
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. **Clone and Setup**:
   ```bash
   git clone https://github.com/YourUsername/Luna-Services.git
   cd Luna-Services
   uv sync
   ```

3. **Test MCP Server**:
   ```bash
   uv run python run_mcp.py
   ```

## IDE-Specific Configuration

### VSCode/Cursor

1. **Install MCP Extension** (if available)
2. **Configure Settings**:
   
   Create or update `.vscode/settings.json`:
   ```json
   {
     "mcp.servers": {
       "luna-services": {
         "command": "uv",
         "args": ["run", "python", "run_mcp.py"],
         "cwd": "/absolute/path/to/Luna-Services"
       }
     }
   }
   ```

3. **Alternative Configuration**:
   
   Copy the provided `.cursor/mcp.json` to your VSCode settings directory.

### Claude Desktop

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "luna-services": {
      "command": "uv",
      "args": ["run", "python", "/absolute/path/to/Luna-Services/run_mcp.py"],
      "env": {
        "OPENAI_API_KEY": "your-api-key",
        "GOOGLE_API_KEY": "your-gemini-api-key"
      }
    }
  }
}
```

### Zed Editor

Configure in `~/.config/zed/settings.json`:

```json
{
  "assistant": {
    "mcp_servers": [
      {
        "name": "luna-services",
        "command": "uv",
        "args": ["run", "python", "/absolute/path/to/Luna-Services/run_mcp.py"]
      }
    ]
  }
}
```

### IntelliJ IDEA / PyCharm

1. **Install MCP Plugin** (when available)
2. **External Tools Setup**:
   - Go to File → Settings → Tools → External Tools
   - Add new tool:
     - Name: Luna MCP Server
     - Program: `uv`
     - Arguments: `run python run_mcp.py`
     - Working Directory: `$ProjectFileDir$`

### Vim/Neovim

Add to your `.vimrc` or `init.lua`:

```lua
-- For Neovim with LSP support
local lspconfig = require('lspconfig')

-- Custom MCP server configuration
lspconfig.luna_mcp = {
  cmd = { 'uv', 'run', 'python', '/absolute/path/to/Luna-Services/run_mcp.py' },
  filetypes = { 'python', 'javascript', 'typescript', 'markdown' },
  root_dir = lspconfig.util.root_pattern('.git', 'pyproject.toml'),
}
```

### Emacs

Add to your Emacs configuration:

```elisp
;; Luna MCP Server integration
(defun luna-mcp-start ()
  "Start Luna MCP server"
  (interactive)
  (start-process "luna-mcp" "*luna-mcp*" 
                 "uv" "run" "python" 
                 "/absolute/path/to/Luna-Services/run_mcp.py"))

;; Key binding
(global-set-key (kbd "C-c l m") 'luna-mcp-start)
```

## Advanced Configuration

### Environment Variables

Set these environment variables for full functionality:

```bash
# Required for AI services
export OPENAI_API_KEY="your-openai-api-key"
export GOOGLE_API_KEY="your-gemini-api-key"

# Optional for enhanced features
export ANTHROPIC_API_KEY="your-anthropic-api-key"
export NVIDIA_API_KEY="your-nvidia-api-key"

# Database configuration (optional)
export SUPABASE_URL="your-supabase-url"
export SUPABASE_ANON_KEY="your-supabase-key"
```

### Custom Transport Protocols

Luna Services supports multiple transport methods:

1. **STDIO Protocol** (Default):
   ```bash
   uv run serve_stdio
   ```

2. **SSE Server** (Web-based):
   ```bash
   uv run serve_sse --port 8000
   ```

3. **WebSocket** (Future):
   ```bash
   uv run serve_websocket --port 8001
   ```

### Docker Support

For containerized environments:

```dockerfile
FROM python:3.11-slim

# Install UV
RUN pip install uv

# Copy project
COPY . /app
WORKDIR /app

# Install dependencies
RUN uv sync

# Expose MCP port
EXPOSE 8000

# Start MCP server
CMD ["uv", "run", "serve_sse", "--port", "8000"]
```

## Troubleshooting

### Common Issues

1. **Import Errors**:
   ```bash
   # Reinstall dependencies
   uv sync --reinstall
   ```

2. **Permission Issues (macOS/Linux)**:
   ```bash
   chmod +x run_mcp.py
   ```

3. **Path Issues**:
   - Use absolute paths in configurations
   - Verify UV is in your PATH: `which uv`

4. **API Key Issues**:
   - Verify environment variables are set
   - Check `.env` file in project root

### Debug Mode

Enable debug logging:

```bash
export MCP_DEBUG=1
uv run python run_mcp.py
```

### Health Check

Test server connectivity:

```bash
# Test STDIO
echo '{"jsonrpc": "2.0", "method": "ping", "id": 1}' | uv run python run_mcp.py

# Test SSE (if running)
curl http://localhost:8000/health
```

## Feature Support Matrix

| Feature | VSCode | Cursor | Claude Desktop | Zed | IntelliJ | Vim/Neovim |
|---------|--------|--------|----------------|-----|----------|------------|
| STDIO Protocol | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ |
| SSE Protocol | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Auto-completion | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Error Handling | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Multi-language | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

**Legend**: ✅ Full Support, ⚠️ Partial Support, ❌ Not Supported

## Contributing

To add support for additional IDEs:

1. Create configuration template in `ide-configs/`
2. Test with sample project
3. Document setup steps
4. Submit PR with test results

## Support

For IDE-specific issues:
- Check the [GitHub Issues](https://github.com/YourUsername/Luna-Services/issues)
- Join our [Discord Community](https://discord.gg/luna-services)
- Read the [MCP Documentation](./MCP_IMPLEMENTATION_GUIDE.md)

---

**Made with ❤️ for universal AI development**
