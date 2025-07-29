"""
Universal MCP Server for Luna Services AI Development Assistant

Compatible with:
- VS Code MCP Extension
- Cursor IDE
- Claude Desktop  
- Any MCP-compatible client
- AutoMCP framework
- Direct execution on Mac/Linux/Windows

Supports all major programming languages and open-source libraries.
"""

import warnings
import os
import sys
import platform
from typing import Any, Dict, Optional, List
from pathlib import Path
from pydantic import BaseModel

# Suppress warnings that might corrupt STDIO protocol
warnings.filterwarnings("ignore")
os.environ["PYTHONWARNINGS"] = "ignore"

# Platform-specific optimizations
IS_MAC = platform.system() == "Darwin"
IS_WINDOWS = platform.system() == "Windows"
IS_LINUX = platform.system() == "Linux"

# MCP Client Detection
def detect_mcp_client():
    """Detect which MCP client is being used"""
    if "cursor" in os.environ.get("TERM_PROGRAM", "").lower():
        return "cursor"
    elif "claude" in os.environ.get("USER", "").lower():
        return "claude"
    elif "code" in os.environ.get("TERM_PROGRAM", "").lower():
        return "vscode"
    else:
        return "generic"

MCP_CLIENT = detect_mcp_client()
logger_prefix = f"[Luna-MCP-{MCP_CLIENT.upper()}]"

# FastMCP Import with fallbacks
try:
    from mcp.server.fastmcp import FastMCP
    MCP_BACKEND = "fastmcp"
except ImportError:
    try:
        from fastmcp import FastMCP
        MCP_BACKEND = "fastmcp-alt"
    except ImportError:
        try:
            # Fallback for basic MCP protocol
            from mcp.server import Server
            from mcp.types import Tool
            MCP_BACKEND = "mcp-basic"
            print(f"{logger_prefix} Using basic MCP server (FastMCP not available)")
        except ImportError:
            print(f"{logger_prefix} Error: No MCP server implementation found")
            print("Please install: pip install naptha-automcp mcp")
            sys.exit(1)

import warnings
import os
import sys
from typing import Any, Dict, Optional
from pydantic import BaseModel

# Suppress warnings that might corrupt STDIO protocol
warnings.filterwarnings("ignore")

# Set environment variable to ignore Python warnings  
os.environ["PYTHONWARNINGS"] = "ignore"

try:
    from mcp.server.fastmcp import FastMCP
except ImportError:
    try:
        # Alternative import path for different versions
        from mcp.server.fastmcp import FastMCP
    except ImportError:
        print("FastMCP not available. Please install: pip install naptha-automcp")
        sys.exit(1)

# Initialize MCP server with detected backend
if MCP_BACKEND.startswith("fastmcp"):
    mcp = FastMCP("Luna Services Universal MCP (BETA)")
    print(f"{logger_prefix} Initialized FastMCP server")
else:
    # Basic MCP server fallback
    mcp = Server("luna-services-mcp")
    print(f"{logger_prefix} Initialized basic MCP server")

print(f"{logger_prefix} Platform: {platform.system()} {platform.release()}")
print(f"{logger_prefix} Python: {sys.version.split()[0]}")
print(f"{logger_prefix} Client: {MCP_CLIENT}")
print(f"{logger_prefix} Backend: {MCP_BACKEND}")

# Enhanced Luna Services MCP imports with graceful degradation
try:
    from backend.app.mcp.service_enhanced import EnhancedMCPService
    from backend.app.mcp.models import (
        MCPRequest, MCPResponse, MCPTaskType, ProgrammingLanguage,
        CodeGenerationRequest, DebuggingRequest, ArchitectureRequest,
        VoiceCommandRequest, MCPConfig, GeminiConfig, LangChainConfig, RivaConfig
    )
    LUNA_SERVICES_AVAILABLE = True
    print(f"{logger_prefix} Luna Services components loaded successfully")
except ImportError as e:
    print(f"{logger_prefix} Warning: Luna Services components not available: {e}")
    print(f"{logger_prefix} Running in minimal mode with basic MCP functionality")
    LUNA_SERVICES_AVAILABLE = False
    
    # Minimal fallback classes
    class MCPTaskType:
        CODE_GENERATION = "code_generation"
        DEBUGGING = "debugging"
        ARCHITECTURE_DESIGN = "architecture_design"
        API_INTEGRATION = "api_integration"
        DOCUMENTATION = "documentation"
        TESTING = "testing"
    
    class ProgrammingLanguage:
        PYTHON = "python"
        JAVASCRIPT = "javascript"
        TYPESCRIPT = "typescript"
        JAVA = "java"
        CPP = "cpp"

# Define input schema for AutoMCP compatibility
class LunaMCPInputSchema(BaseModel):
    """Input schema for Luna Services MCP operations"""
    task_type: str = "code_generation"  # Type of MCP task
    prompt: str  # The main request/prompt
    language: str = "python"  # Programming language
    context: Dict[str, Any] = {}  # Additional context
    user_id: str = "automcp-user"  # User identifier
    project_id: Optional[str] = None  # Optional project ID
    include_tests: bool = True  # Include test generation
    include_documentation: bool = True  # Include documentation
    priority: int = 1  # Task priority (1-5)

# MCP service configuration
def get_mcp_config() -> MCPConfig:
    """Get MCP configuration from environment variables"""
    return MCPConfig(
        gemini=GeminiConfig(
            api_key=os.getenv("GEMINI_API_KEY", ""),
            model_name=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
            temperature=float(os.getenv("GEMINI_TEMPERATURE", "0.7")),
            max_tokens=int(os.getenv("GEMINI_MAX_TOKENS", "8192"))
        ),
        langchain=LangChainConfig(
            chain_type=os.getenv("LANGCHAIN_CHAIN_TYPE", "conversational"),
            memory_type=os.getenv("LANGCHAIN_MEMORY_TYPE", "conversation_buffer"),
            max_memory_length=int(os.getenv("LANGCHAIN_MAX_MEMORY", "10"))
        ),
        riva=RivaConfig(
            server_url=os.getenv("RIVA_SERVER_URL", "http://localhost:50051"),
            language_code=os.getenv("RIVA_LANGUAGE", "en-US"),
            voice_name=os.getenv("RIVA_VOICE", "English-US.Female-1"),
            sample_rate=int(os.getenv("RIVA_SAMPLE_RATE", "22050"))
        ),
        vector_db_url=os.getenv("VECTOR_DB_URL", "http://localhost:8000"),
        max_concurrent_requests=int(os.getenv("MCP_MAX_CONCURRENT", "100")),
        enable_voice=os.getenv("MCP_ENABLE_VOICE", "true").lower() == "true",
        enable_multimodal=os.getenv("MCP_ENABLE_MULTIMODAL", "true").lower() == "true",
        enable_analytics=os.getenv("MCP_ENABLE_ANALYTICS", "true").lower() == "true"
    )

# Initialize the Enhanced MCP Service
config = get_mcp_config()
mcp_service = EnhancedMCPService(config)

# Define the main MCP tool function
async def luna_mcp_processor(
    task_type: str,
    prompt: str,
    language: str = "python",
    context: Dict[str, Any] = {},
    user_id: str = "automcp-user",
    project_id: Optional[str] = None,
    include_tests: bool = True,
    include_documentation: bool = True,
    priority: int = 1
) -> Dict[str, Any]:
    """
    Process MCP requests using Luna Services Universal MCP System
    
    This function provides AI-powered development assistance including:
    - Code generation and optimization
    - Debugging and error resolution  
    - Architecture design and planning
    - API integration and testing
    - Documentation generation
    - Voice-enabled development commands
    
    Args:
        task_type: Type of MCP task (code_generation, debugging, architecture_design, etc.)
        prompt: The main request or prompt describing what you want
        language: Programming language for the task
        context: Additional context and parameters
        user_id: User identifier for session tracking
        project_id: Optional project identifier
        include_tests: Whether to include test generation
        include_documentation: Whether to include documentation
        priority: Task priority from 1 (highest) to 5 (lowest)
        
    Returns:
        Dictionary containing the AI-generated response with code, explanations, and suggestions
    """
    try:
        # Validate and convert task type
        try:
            mcp_task_type = MCPTaskType(task_type)
        except ValueError:
            mcp_task_type = MCPTaskType.CODE_GENERATION
            
        # Validate and convert programming language
        try:
            prog_language = ProgrammingLanguage(language.lower())
        except ValueError:
            prog_language = ProgrammingLanguage.PYTHON
            
        # Create enhanced context
        enhanced_context = {
            "include_tests": include_tests,
            "include_documentation": include_documentation,
            **context
        }
        
        # Create MCP request based on task type
        if mcp_task_type == MCPTaskType.CODE_GENERATION:
            request = CodeGenerationRequest(
                task_type=mcp_task_type,
                user_id=user_id,
                project_id=project_id,
                language=prog_language,
                prompt=prompt,
                context=enhanced_context,
                priority=priority,
                include_tests=include_tests,
                include_documentation=include_documentation
            )
        elif mcp_task_type == MCPTaskType.DEBUGGING:
            request = DebuggingRequest(
                task_type=mcp_task_type,
                user_id=user_id,
                project_id=project_id,
                language=prog_language,
                prompt=prompt,
                context=enhanced_context,
                priority=priority,
                error_message=context.get("error_message", prompt),
                code_snippet=context.get("code_snippet", ""),
                stack_trace=context.get("stack_trace")
            )
        elif mcp_task_type == MCPTaskType.ARCHITECTURE_DESIGN:
            request = ArchitectureRequest(
                task_type=mcp_task_type,
                user_id=user_id,
                project_id=project_id,
                language=prog_language,
                prompt=prompt,
                context=enhanced_context,
                priority=priority,
                system_requirements=context.get("system_requirements", [prompt]),
                constraints=context.get("constraints", []),
                preferred_technologies=context.get("preferred_technologies", []),
                scale_requirements=context.get("scale_requirements", {})
            )
        else:
            # Default to base MCPRequest for other task types
            request = MCPRequest(
                task_type=mcp_task_type,
                user_id=user_id,
                project_id=project_id,
                language=prog_language,
                prompt=prompt,
                context=enhanced_context,
                priority=priority
            )
        
        # Process the request using Luna's Enhanced MCP Service
        response = await mcp_service.process_request(request)
        
        # Format response for AutoMCP compatibility
        result = {
            "status": response.status,
            "request_id": response.request_id,
            "task_type": str(mcp_task_type.value),
            "language": str(prog_language.value),
            "generated_code": response.generated_code,
            "explanation": response.explanation,
            "suggestions": response.suggestions or [],
            "confidence_score": response.confidence_score,
            "execution_time": response.execution_time,
            "tokens_used": response.tokens_used
        }
        
        # Add additional result data if available
        if response.result:
            result.update(response.result)
            
        # Add error information if present
        if response.error_message:
            result["error_message"] = response.error_message
            
        # Add voice output if available
        if response.voice_output:
            result["voice_output"] = response.voice_output
            
        return result
        
    except Exception as e:
        # Return error response
        return {
            "status": "error",
            "error_message": str(e),
            "task_type": task_type,
            "language": language,
            "execution_time": 0.0
        }

# Register the tool with FastMCP
mcp.add_tool(
    luna_mcp_processor,
    name="luna_mcp_processor", 
    description="""
    Luna Services Universal MCP System - AI-Powered Development Assistant
    
    A comprehensive AI development toolkit that provides:
    • Code generation and optimization for 20+ programming languages
    • Advanced debugging and error resolution
    • System architecture design and planning  
    • API integration and testing assistance
    • Automated documentation generation
    • Voice-enabled development commands
    • Multi-modal input support (text, voice, images)
    
    Powered by Google Gemini 2.5 Flash, LangChain orchestration, and NVIDIA Riva TTS.
    Perfect for developers who want AI assistance with complex development tasks.
    """
)

# Server entrypoints for AutoMCP compatibility
def serve_sse():
    """Serve using Server-Sent Events transport"""
    mcp.run(transport="sse")

def serve_stdio():
    """Serve using STDIO transport (for MCP clients like Cursor)"""
    # Redirect stderr to suppress warnings that bypass the filters
    class NullWriter:
        def write(self, *args, **kwargs):
            pass
        def flush(self, *args, **kwargs):
            pass

    # Save the original stderr
    original_stderr = sys.stderr

    # Replace stderr with our null writer to prevent warnings from corrupting STDIO
    sys.stderr = NullWriter()

    try:
        mcp.run(transport="stdio")
    finally:
        # Restore stderr for normal operation
        sys.stderr = original_stderr

# Main execution
if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "sse":
        serve_sse()
    else:
        serve_stdio()
