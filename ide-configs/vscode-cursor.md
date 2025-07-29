# VSCode/Cursor Configuration for Luna Services MCP

This guide provides multiple ways to configure Luna Services MCP in VSCode or Cursor.

## Method 1: User Settings (Recommended)

Add to your VSCode/Cursor settings (`settings.json`):

```json
{
  "mcp.servers": {
    "luna-services": {
      "command": "uv",
      "args": ["run", "python", "run_mcp.py"],
      "cwd": "/absolute/path/to/Luna-Services",
      "env": {
        "OPENAI_API_KEY": "your-openai-api-key",
        "GOOGLE_API_KEY": "your-gemini-api-key"
      }
    }
  }
}
```

## Method 2: Workspace Settings

Create `.vscode/settings.json` in your project root:

```json
{
  "mcp.servers": {
    "luna-services-workspace": {
      "command": "uv",
      "args": ["run", "--directory", "${workspaceFolder}", "serve_stdio"],
      "env": {
        "GEMINI_API_KEY": "your-google-gemini-api-key",
        "OPENAI_API_KEY": "your-openai-api-key",
        "MCP_TRANSPORT": "stdio"
      }
    }
  }
}
```

## Method 3: Using MCP Extension

1. Install the MCP extension from the marketplace
2. Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
3. Run "MCP: Add Server"
4. Choose "Custom Server"
5. Enter configuration:
   - **Name**: `luna-services`
   - **Command**: `uv`
   - **Args**: `["run", "python", "run_mcp.py"]`
   - **Working Directory**: `/absolute/path/to/Luna-Services`

## Method 4: Tasks Configuration

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Luna MCP Server",
      "type": "shell",
      "command": "uv",
      "args": ["run", "python", "run_mcp.py"],
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      },
      "options": {
        "cwd": "${workspaceFolder}"
      },
      "problemMatcher": [],
      "isBackground": true
    }
  ]
}
```

## Method 5: Launch Configuration

Create `.vscode/launch.json` for debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Luna MCP Server",
      "type": "python",
      "request": "launch",
      "program": "${workspaceFolder}/run_mcp.py",
      "console": "integratedTerminal",
      "justMyCode": false,
      "env": {
        "MCP_DEBUG": "1",
        "PYTHONPATH": "${workspaceFolder}",
        "OPENAI_API_KEY": "your-openai-api-key",
        "GOOGLE_API_KEY": "your-gemini-api-key"
      }
    }
  ]
}
```

## Extensions to Install

For the best experience, install these VSCode extensions:

```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.vscode-pylance",
    "charliermarsh.ruff",
    "ms-vscode.vscode-json",
    "redhat.vscode-yaml",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode"
  ]
}
```

Save this as `.vscode/extensions.json` to automatically suggest these extensions.

## Keyboard Shortcuts

Add to `keybindings.json`:

```json
[
  {
    "key": "ctrl+shift+m",
    "command": "workbench.action.tasks.runTask",
    "args": "Start Luna MCP Server"
  },
  {
    "key": "ctrl+shift+d",
    "command": "workbench.action.debug.start",
    "args": "Debug Luna MCP Server"
  }
]
```

## Troubleshooting

### Common Issues

1. **Command not found**: Ensure UV is installed and in PATH
2. **Permission denied**: Run `chmod +x run_mcp.py` on Unix systems
3. **Import errors**: Run `uv sync` to install dependencies
4. **API key errors**: Set environment variables correctly

### Debug Mode

Enable debug logging by setting:

```json
{
  "mcp.debug": true,
  "mcp.servers": {
    "luna-services": {
      "env": {
        "MCP_DEBUG": "1"
      }
    }
  }
}
```

### Log Locations

- **Windows**: `%APPDATA%\Code\logs\`
- **macOS**: `~/Library/Logs/VSCode/`
- **Linux**: `~/.config/Code/logs/`

## Features in VSCode/Cursor

- ✅ Intelligent code completion
- ✅ Real-time error detection
- ✅ Integrated debugging
- ✅ Multi-language support
- ✅ Project navigation
- ✅ Terminal integration
- ✅ Git integration
- ✅ Extension ecosystem
