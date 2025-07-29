# Zed Editor Configuration for Luna Services MCP

Configure Luna Services MCP in Zed Editor for modern AI-powered development.

## Configuration Location

Add to your Zed settings file:
- **Location**: `~/.config/zed/settings.json`

## Basic Configuration

```json
{
  "assistant": {
    "mcp_servers": [
      {
        "name": "luna-services",
        "command": "uv",
        "args": ["run", "python", "/absolute/path/to/Luna-Services/run_mcp.py"],
        "env": {
          "OPENAI_API_KEY": "your-openai-api-key",
          "GOOGLE_API_KEY": "your-gemini-api-key"
        }
      }
    ]
  }
}
```

## Advanced Configuration

```json
{
  "assistant": {
    "enabled": true,
    "mcp_servers": [
      {
        "name": "luna-services-full",
        "command": "uv",
        "args": ["run", "--directory", "/absolute/path/to/Luna-Services", "serve_stdio"],
        "working_directory": "/absolute/path/to/Luna-Services",
        "env": {
          "GEMINI_API_KEY": "your-google-gemini-api-key",
          "OPENAI_API_KEY": "your-openai-api-key",
          "MCP_ENABLE_VOICE": "true",
          "MCP_ENABLE_MULTIMODAL": "true",
          "MCP_TRANSPORT": "stdio"
        }
      }
    ]
  },
  "languages": {
    "Python": {
      "language_servers": ["pylsp", "pyright"],
      "format_on_save": "on"
    },
    "TypeScript": {
      "language_servers": ["typescript-language-server"],
      "format_on_save": "on"
    },
    "JavaScript": {
      "language_servers": ["typescript-language-server"],
      "format_on_save": "on"
    }
  }
}
```

## Project-Specific Configuration

Create `.zed/settings.json` in your project root:

```json
{
  "assistant": {
    "mcp_servers": [
      {
        "name": "luna-services-project",
        "command": "uv",
        "args": ["run", "python", "run_mcp.py"],
        "working_directory": ".",
        "env": {
          "MCP_DEBUG": "1"
        }
      }
    ]
  }
}
```

## GitHub Integration

For direct GitHub installation:

```json
{
  "assistant": {
    "mcp_servers": [
      {
        "name": "luna-services-github",
        "command": "uvx",
        "args": ["--from", "git+https://github.com/YourUsername/Luna-Services", "serve_stdio"],
        "env": {
          "GEMINI_API_KEY": "your-google-gemini-api-key"
        }
      }
    ]
  }
}
```

## Keybindings

Add to `~/.config/zed/keymap.json`:

```json
[
  {
    "context": "Editor",
    "bindings": {
      "cmd-shift-a": "assistant:toggle",
      "cmd-shift-m": "assistant:mcp_restart",
      "cmd-shift-l": "assistant:mcp_logs"
    }
  }
]
```

## Extensions

Install these Zed extensions for enhanced functionality:

1. **Python** - Python language support
2. **TypeScript** - TypeScript/JavaScript support
3. **Markdown** - Markdown editing
4. **Git** - Git integration
5. **Terminal** - Integrated terminal

## Theme and UI

Configure for best MCP experience:

```json
{
  "theme": "One Dark",
  "ui_font_size": 16,
  "buffer_font_size": 14,
  "ui_font_family": "SF Pro Display",
  "buffer_font_family": "JetBrains Mono",
  "show_whitespaces": "selection",
  "tab_size": 4,
  "soft_wrap": "editor_width",
  "assistant": {
    "default_width": 400,
    "dock": "right"
  }
}
```

## Terminal Integration

Configure integrated terminal:

```json
{
  "terminal": {
    "shell": {
      "program": "zsh"
    },
    "env": {
      "OPENAI_API_KEY": "your-openai-api-key",
      "GOOGLE_API_KEY": "your-gemini-api-key"
    },
    "working_directory": "current_project_directory"
  }
}
```

## Troubleshooting

### Common Issues

1. **Assistant not responding**: Check MCP server logs in Zed's debug panel
2. **Command not found**: Ensure `uv` is in your PATH
3. **Connection timeout**: Verify server is running and accessible

### Debug Mode

Enable detailed logging:

```json
{
  "assistant": {
    "debug": true,
    "mcp_servers": [
      {
        "name": "luna-services-debug",
        "env": {
          "MCP_DEBUG": "1",
          "RUST_LOG": "debug"
        }
      }
    ]
  }
}
```

### Performance Optimization

```json
{
  "assistant": {
    "max_concurrent_requests": 4,
    "request_timeout": 30000,
    "mcp_servers": [
      {
        "name": "luna-services",
        "restart_on_crash": true,
        "max_restarts": 3
      }
    ]
  }
}
```

## Features in Zed

- ✅ Fast, native performance
- ✅ Built-in AI assistant
- ✅ Collaborative editing
- ✅ Modern UI/UX
- ✅ Integrated terminal
- ✅ Git integration
- ✅ Multi-language support
- ✅ Real-time collaboration

## Tips for Best Experience

1. **Use split panes** for code and assistant side-by-side
2. **Enable auto-save** for seamless workflow
3. **Configure shortcuts** for quick MCP actions
4. **Use project search** for codebase navigation
5. **Enable format on save** for consistent code style
