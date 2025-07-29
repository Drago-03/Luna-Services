# Claude Desktop Configuration for Luna Services MCP

Add this configuration to your Claude Desktop app settings file:

**Location**: 
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

## Basic Configuration

```json
{
  "mcpServers": {
    "luna-services": {
      "command": "uv",
      "args": ["run", "python", "/absolute/path/to/Luna-Services/run_mcp.py"],
      "env": {
        "OPENAI_API_KEY": "your-openai-api-key",
        "GOOGLE_API_KEY": "your-gemini-api-key"
      }
    }
  }
}
```

## Advanced Configuration with All Features

```json
{
  "mcpServers": {
    "luna-services-full": {
      "command": "uv",
      "args": ["run", "--directory", "/absolute/path/to/Luna-Services", "serve_stdio"],
      "env": {
        "GEMINI_API_KEY": "your-google-gemini-api-key",
        "OPENAI_API_KEY": "your-openai-api-key",
        "ANTHROPIC_API_KEY": "your-anthropic-api-key",
        "NVIDIA_API_KEY": "your-nvidia-api-key",
        "RIVA_SERVER_URL": "http://localhost:50051",
        "VECTOR_DB_URL": "http://localhost:8000",
        "MCP_ENABLE_VOICE": "true",
        "MCP_ENABLE_MULTIMODAL": "true",
        "MCP_ENABLE_ANALYTICS": "true",
        "MCP_TRANSPORT": "stdio"
      }
    }
  }
}
```

## GitHub Direct Installation

```json
{
  "mcpServers": {
    "luna-services-github": {
      "command": "uvx",
      "args": ["--from", "git+https://github.com/YourUsername/Luna-Services", "serve_stdio"],
      "env": {
        "GEMINI_API_KEY": "your-google-gemini-api-key",
        "OPENAI_API_KEY": "your-openai-api-key"
      }
    }
  }
}
```

## Troubleshooting

1. **Replace `/absolute/path/to/Luna-Services`** with your actual project path
2. **Add your API keys** to the environment variables
3. **Restart Claude Desktop** after making changes
4. **Check logs** in Claude Desktop developer tools for any errors

## Features Available in Claude Desktop

- ✅ Code analysis and generation
- ✅ Multi-language support (20+ languages)
- ✅ Project documentation
- ✅ Automation workflows
- ✅ MCP server management
- ✅ AI-powered development assistance
- ⚠️ Voice processing (requires NVIDIA Riva setup)
- ⚠️ Real-time collaboration (requires SSE server)
