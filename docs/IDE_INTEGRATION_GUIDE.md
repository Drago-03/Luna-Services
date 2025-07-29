# Universal MCP Configuration for Different IDEs

## Luna Services Universal MCP - Multi-IDE Support

This document provides configuration examples for using Luna Services MCP across different development environments.

### VS Code MCP Extension

Create `.vscode/settings.json`:
```json
{
  "mcp.servers": {
    "luna-services": {
      "command": "python",
      "args": ["run_mcp.py"],
      "cwd": "${workspaceFolder}",
      "env": {
        "GEMINI_API_KEY": "${env:GEMINI_API_KEY}",
        "MCP_CLIENT": "vscode",
        "MCP_BETA": "true"
      }
    }
  }
}
```

### Cursor IDE

Use existing `.cursor/mcp.json` (already configured)

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac):
```json
{
  "mcpServers": {
    "luna-services": {
      "command": "python",
      "args": ["/path/to/Luna-Services/run_mcp.py"],
      "env": {
        "GEMINI_API_KEY": "your-api-key-here",
        "MCP_CLIENT": "claude",
        "MCP_BETA": "true"
      }
    }
  }
}
```

### JetBrains IDEs (IntelliJ, PyCharm, WebStorm)

Install MCP plugin and configure:
```json
{
  "mcp": {
    "servers": {
      "luna-services": {
        "command": "python",
        "args": ["run_mcp.py"],
        "workingDirectory": "${PROJECT_DIR}",
        "environment": {
          "GEMINI_API_KEY": "${GEMINI_API_KEY}",
          "MCP_CLIENT": "jetbrains",
          "MCP_BETA": "true"
        }
      }
    }
  }
}
```

### Sublime Text

Install MCP package and configure in `Packages/User/MCP.sublime-settings`:
```json
{
  "servers": {
    "luna-services": {
      "command": ["python", "run_mcp.py"],
      "env": {
        "GEMINI_API_KEY": "${GEMINI_API_KEY}",
        "MCP_CLIENT": "sublime",
        "MCP_BETA": "true"
      }
    }
  }
}
```

### Vim/Neovim

With MCP plugin:
```lua
require('mcp').setup({
  servers = {
    luna_services = {
      command = 'python',
      args = {'run_mcp.py'},
      env = {
        GEMINI_API_KEY = vim.env.GEMINI_API_KEY,
        MCP_CLIENT = 'neovim',
        MCP_BETA = 'true'
      }
    }
  }
})
```

### Emacs

With MCP mode:
```elisp
(setq mcp-servers
  '((luna-services
     :command "python"
     :args ("run_mcp.py")
     :env (("GEMINI_API_KEY" . (getenv "GEMINI_API_KEY"))
           ("MCP_CLIENT" . "emacs")
           ("MCP_BETA" . "true")))))
```

### Terminal/Command Line

Direct usage:
```bash
# Set environment
export GEMINI_API_KEY="your-api-key-here"
export MCP_CLIENT="terminal"
export MCP_BETA="true"

# Run MCP server
python run_mcp.py

# Or with UV
uv run serve_stdio
```

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY . .

RUN pip install -r requirements.txt

ENV MCP_CLIENT=docker
ENV MCP_BETA=true

CMD ["python", "run_mcp.py"]
```

### GitHub Codespaces

Add to `.devcontainer/devcontainer.json`:
```json
{
  "customizations": {
    "vscode": {
      "settings": {
        "mcp.servers": {
          "luna-services": {
            "command": "python",
            "args": ["run_mcp.py"],
            "env": {
              "GEMINI_API_KEY": "${localEnv:GEMINI_API_KEY}",
              "MCP_CLIENT": "codespaces",
              "MCP_BETA": "true"
            }
          }
        }
      }
    }
  }
}
```

## Environment Variables

Required:
- `GEMINI_API_KEY`: Your Google Gemini API key

Optional:
- `MCP_CLIENT`: Detected automatically, but can be overridden
- `MCP_BETA`: Set to "true" to enable beta features
- `MCP_MODE`: "development" or "production" 
- `MCP_ENABLE_VOICE`: "true" to enable voice features (requires additional setup)
- `MCP_ENABLE_ANALYTICS`: "true" to enable usage analytics

## Testing Your Setup

```bash
# Test MCP server
python -c "from run_mcp import serve_stdio; print('✅ MCP server ready')"

# Test with different clients
MCP_CLIENT=vscode python run_mcp.py
MCP_CLIENT=cursor python run_mcp.py  
MCP_CLIENT=claude python run_mcp.py
```

## Troubleshooting

### Common Issues

1. **Import errors**: Ensure all dependencies are installed
2. **API key issues**: Verify GEMINI_API_KEY is set correctly
3. **Path issues**: Use absolute paths in IDE configurations
4. **Permission issues**: Ensure Python script is executable

### Debug Mode

```bash
export MCP_DEBUG=true
export MCP_VERBOSE=true
python run_mcp.py
```

This will provide detailed logging for troubleshooting.
