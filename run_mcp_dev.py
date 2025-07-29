#!/usr/bin/env python3
"""
Standalone AutoMCP-compatible server for Luna Services (Development Version)

This version works without external FastMCP dependencies for development and testing.
For production use, install: pip install naptha-automcp
"""

import warnings
import os
import sys
import json
import asyncio
from typing import Any, Dict, Optional
from pydantic import BaseModel
from pathlib import Path

# Suppress warnings that might corrupt STDIO protocol
warnings.filterwarnings("ignore")
os.environ["PYTHONWARNINGS"] = "ignore"

# Add project root to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

# Try to import FastMCP, fallback to mock if not available
try:
    from mcp.server.fastmcp import FastMCP
    FASTMCP_AVAILABLE = True
except ImportError:
    FASTMCP_AVAILABLE = False
    print("Warning: FastMCP not available. Install with: pip install naptha-automcp", file=sys.stderr)
    
    # Mock FastMCP for development
    class FastMCP:
        def __init__(self, name):
            self.name = name
            self.tools = {}
            
        def add_tool(self, func, name, description):
            self.tools[name] = {
                'function': func,
                'description': description
            }
            
        def run(self, transport="stdio"):
            print(f"Mock FastMCP server '{self.name}' would run with transport: {transport}")
            if transport == "stdio":
                self._run_stdio_mock()
            else:
                self._run_sse_mock()
                
        def _run_stdio_mock(self):
            """Mock STDIO server for development"""
            print("Mock STDIO server running. Available tools:", list(self.tools.keys()))
            
        def _run_sse_mock(self):
            """Mock SSE server for development"""
            print(f"Mock SSE server running on http://localhost:8000")
            print("Available tools:", list(self.tools.keys()))

# Initialize FastMCP server
mcp = FastMCP("Luna Services Universal MCP")

# Import Luna Services MCP components with error handling
try:
    from backend.app.mcp.service_enhanced import EnhancedMCPService
    from backend.app.mcp.models import (
        MCPRequest, MCPResponse, MCPTaskType, ProgrammingLanguage,
        CodeGenerationRequest, DebuggingRequest, ArchitectureRequest,
        VoiceCommandRequest, MCPConfig, GeminiConfig, LangChainConfig, RivaConfig
    )
    LUNA_SERVICES_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Luna Services modules not fully available: {e}", file=sys.stderr)
    LUNA_SERVICES_AVAILABLE = False
    
    # Mock the necessary components for development
    from enum import Enum
    
    class MCPTaskType(str, Enum):
        CODE_GENERATION = "code_generation"
        DEBUGGING = "debugging"
        ARCHITECTURE_DESIGN = "architecture_design"
        
    class ProgrammingLanguage(str, Enum):
        PYTHON = "python"
        JAVASCRIPT = "javascript"
        TYPESCRIPT = "typescript"

# Define input schema for AutoMCP compatibility
class LunaMCPInputSchema(BaseModel):
    """Input schema for Luna Services MCP operations"""
    task_type: str = "code_generation"
    prompt: str
    language: str = "python"
    context: Dict[str, Any] = {}
    user_id: str = "automcp-user"
    project_id: Optional[str] = None
    include_tests: bool = True
    include_documentation: bool = True
    priority: int = 1

# Mock MCP service for when full Luna Services is not available
class MockMCPService:
    """Mock MCP service for development and testing"""
    
    async def process_request(self, request) -> Dict[str, Any]:
        """Mock processing function"""
        return {
            "status": "success",
            "request_id": "mock-request-id",
            "task_type": request.get("task_type", "code_generation"),
            "language": request.get("language", "python"),
            "generated_code": f"# Mock {request.get('task_type', 'code')} for: {request.get('prompt', 'No prompt')}\nprint('Hello from Luna Services MCP!')",
            "explanation": f"This is a mock response for {request.get('task_type', 'code generation')}. Install full Luna Services for real AI-powered responses.",
            "suggestions": ["Install full dependencies", "Configure API keys", "Test with real AI models"],
            "confidence_score": 0.8,
            "execution_time": 0.1,
            "tokens_used": 50
        }

# Initialize MCP service
if LUNA_SERVICES_AVAILABLE:
    # Try to initialize real service
    try:
        from run_mcp import get_mcp_config
        config = get_mcp_config()
        mcp_service = EnhancedMCPService(config)
    except Exception as e:
        print(f"Warning: Could not initialize full MCP service: {e}", file=sys.stderr)
        mcp_service = MockMCPService()
else:
    mcp_service = MockMCPService()

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
        # Create request object
        request_data = {
            "task_type": task_type,
            "prompt": prompt,
            "language": language,
            "context": {
                "include_tests": include_tests,
                "include_documentation": include_documentation,
                **context
            },
            "user_id": user_id,
            "project_id": project_id,
            "priority": priority
        }
        
        # Process with the available service
        if hasattr(mcp_service, 'process_request') and LUNA_SERVICES_AVAILABLE:
            # Try to create proper request object
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
                
                # Create proper MCP request
                request = MCPRequest(
                    task_type=mcp_task_type,
                    user_id=user_id,
                    project_id=project_id,
                    language=prog_language,
                    prompt=prompt,
                    context=request_data["context"],
                    priority=priority
                )
                
                response = await mcp_service.process_request(request)
                
                # Format response for AutoMCP compatibility
                return {
                    "status": response.status,
                    "request_id": response.request_id,
                    "task_type": str(mcp_task_type.value),
                    "language": str(prog_language.value),
                    "generated_code": response.generated_code,
                    "explanation": response.explanation,
                    "suggestions": response.suggestions or [],
                    "confidence_score": response.confidence_score,
                    "execution_time": response.execution_time,
                    "tokens_used": response.tokens_used,
                    "error_message": response.error_message,
                    "voice_output": response.voice_output
                }
                
            except Exception as e:
                # Fall back to mock service
                print(f"Warning: Full service failed, using mock: {e}", file=sys.stderr)
                return await mcp_service.process_request(request_data)
        else:
            # Use mock service
            return await mcp_service.process_request(request_data)
            
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
    if FASTMCP_AVAILABLE:
        mcp.run(transport="sse")
    else:
        print("SSE server would start at http://localhost:8000")
        print("Install 'pip install naptha-automcp' for full functionality")

def serve_stdio():
    """Serve using STDIO transport (for MCP clients like Cursor)"""
    if FASTMCP_AVAILABLE:
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
    else:
        print("STDIO server would start now")
        print("Install 'pip install naptha-automcp' for full functionality")

# Main execution
def main():
    """Main entry point"""
    if len(sys.argv) > 1 and sys.argv[1] == "sse":
        serve_sse()
    elif len(sys.argv) > 1 and sys.argv[1] == "test":
        # Test mode
        print("Luna Services AutoMCP Server - Test Mode")
        print(f"FastMCP Available: {FASTMCP_AVAILABLE}")
        print(f"Luna Services Available: {LUNA_SERVICES_AVAILABLE}")
        print("Available tools:", list(mcp.tools.keys()))
        
        # Test the function
        async def test():
            result = await luna_mcp_processor(
                task_type="code_generation",
                prompt="Create a hello world function",
                language="python"
            )
            print("Test result:", json.dumps(result, indent=2))
        
        asyncio.run(test())
    else:
        serve_stdio()

if __name__ == "__main__":
    main()
