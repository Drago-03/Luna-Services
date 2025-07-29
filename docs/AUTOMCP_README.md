# 🤖 AutoMCP Compatibility Added!

Luna Services Universal MCP is now **fully compatible** with AutoMCP by NapthaAI!

## 🚀 Quick Start with AutoMCP

### Option 1: Direct GitHub Execution
```bash
# Run directly from GitHub (requires GEMINI_API_KEY environment variable)
uvx --from git+https://github.com/Drago-03/Luna-Services serve_stdio
```

### Option 2: Local Development
```bash
# Clone and setup
git clone https://github.com/Drago-03/Luna-Services
cd Luna-Services
uv venv
uv add naptha-automcp

# Set your API key
export GEMINI_API_KEY="your-api-key-here"

# Run the MCP server
uv run serve_stdio  # For STDIO transport
uv run serve_sse    # For SSE transport (port 8000)
```

### Option 3: Naptha MCPaaS Cloud Deployment
1. Go to [labs.naptha.ai](https://labs.naptha.ai/)
2. Sign in with GitHub
3. Select `Luna-Services` repository
4. Add environment variable: `GEMINI_API_KEY`
5. Click Launch
6. Copy the SSE URL for your MCP clients

## 🛠️ Use with MCP Clients

### Cursor IDE
The project includes `.cursor/mcp.json` configuration for easy integration:
- Local STDIO transport
- UV-based execution  
- Direct GitHub execution
- SSE server connection

### Claude Desktop
Add to your Claude Desktop configuration:
```json
{
  "mcpServers": {
    "luna-services": {
      "command": "uvx",
      "args": ["--from", "git+https://github.com/Drago-03/Luna-Services", "serve_stdio"],
      "env": {"GEMINI_API_KEY": "your-api-key-here"}
    }
  }
}
```

## 🎯 What You Get

- **Universal AI Development Assistant**: Code generation, debugging, architecture design
- **20+ Programming Languages**: Python, JavaScript, TypeScript, Java, C++, and more
- **Advanced AI Capabilities**: Powered by Google Gemini 2.5 Flash
- **Production Ready**: Error handling, logging, and analytics
- **Cloud Scalable**: Deploy on Naptha's MCPaaS platform

## 📊 Main Tool: `luna_mcp_processor`

```python
async def luna_mcp_processor(
    task_type: str,           # "code_generation", "debugging", "architecture_design", etc.
    prompt: str,              # Your request in natural language
    language: str = "python", # Programming language
    include_tests: bool = True,       # Generate tests
    include_documentation: bool = True # Generate documentation
) -> Dict[str, Any]
```

**Task Types**: code_generation, debugging, architecture_design, api_integration, documentation, testing

**Languages**: Python, JavaScript, TypeScript, Java, C++, C#, Go, Rust, Swift, Kotlin, PHP, Ruby, and more

---

**Ready to use with any AutoMCP-compatible client!** 🎉

For detailed documentation, see [AUTOMCP_INTEGRATION_SUMMARY.md](./AUTOMCP_INTEGRATION_SUMMARY.md)
