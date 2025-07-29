"""
Universal Model Context Protocol (MCP) Core Module

This module provides the core infrastructure for the Universal MCP system,
integrating Google Gemini 2.5, LangChain, NVIDIA Riva TTS, and other AI tools
for comprehensive AI development assistance.
"""

from typing import Dict, List, Optional, Any, Union
from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime
import uuid

class MCPTaskType(str, Enum):
    """Enumeration of supported MCP task types"""
    CODE_GENERATION = "code_generation"
    CODE_OPTIMIZATION = "code_optimization"
    DEBUGGING = "debugging"
    ARCHITECTURE_DESIGN = "architecture_design"
    API_INTEGRATION = "api_integration"
    DOCUMENTATION = "documentation"
    TESTING = "testing"
    VOICE_COMMAND = "voice_command"
    MULTI_MODAL = "multi_modal"
    WORKFLOW_AUTOMATION = "workflow_automation"

class ProgrammingLanguage(str, Enum):
    """Supported programming languages"""
    PYTHON = "python"
    JAVASCRIPT = "javascript"
    TYPESCRIPT = "typescript"
    JAVA = "java"
    CPP = "cpp"
    CSHARP = "csharp"
    GO = "go"
    RUST = "rust"
    PHP = "php"
    RUBY = "ruby"
    SWIFT = "swift"
    KOTLIN = "kotlin"
    SCALA = "scala"
    R = "r"
    JULIA = "julia"
    HTML = "html"
    CSS = "css"
    SQL = "sql"
    SHELL = "shell"
    DOCKERFILE = "dockerfile"

class MCPRequest(BaseModel):
    """Base model for MCP requests"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    task_type: MCPTaskType
    user_id: str
    project_id: Optional[str] = None
    language: Optional[ProgrammingLanguage] = None
    prompt: str
    context: Optional[Dict[str, Any]] = {}
    files: Optional[List[Dict[str, str]]] = []
    voice_input: Optional[str] = None  # Base64 encoded audio
    image_input: Optional[str] = None  # Base64 encoded image
    priority: int = Field(default=1, ge=1, le=5)  # 1=highest, 5=lowest
    metadata: Optional[Dict[str, Any]] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)

class MCPResponse(BaseModel):
    """Base model for MCP responses"""
    request_id: str
    status: str  # success, error, processing, queued
    result: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    generated_code: Optional[str] = None
    explanation: Optional[str] = None
    suggestions: Optional[List[str]] = []
    confidence_score: Optional[float] = None
    execution_time: Optional[float] = None
    tokens_used: Optional[int] = None
    voice_output: Optional[str] = None  # Base64 encoded audio
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None

class CodeGenerationRequest(MCPRequest):
    """Specialized request for code generation tasks"""
    task_type: MCPTaskType = MCPTaskType.CODE_GENERATION
    function_name: Optional[str] = None
    requirements: List[str] = []
    style_preferences: Optional[Dict[str, str]] = {}
    include_tests: bool = True
    include_documentation: bool = True

class DebuggingRequest(MCPRequest):
    """Specialized request for debugging tasks"""
    task_type: MCPTaskType = MCPTaskType.DEBUGGING
    error_message: str
    stack_trace: Optional[str] = None
    code_snippet: str
    runtime_environment: Optional[Dict[str, str]] = {}

class ArchitectureRequest(MCPRequest):
    """Specialized request for architecture design"""
    task_type: MCPTaskType = MCPTaskType.ARCHITECTURE_DESIGN
    system_requirements: List[str]
    constraints: List[str] = []
    preferred_technologies: List[str] = []
    scale_requirements: Optional[Dict[str, Any]] = {}

class VoiceCommandRequest(MCPRequest):
    """Specialized request for voice commands"""
    task_type: MCPTaskType = MCPTaskType.VOICE_COMMAND
    audio_data: str  # Base64 encoded audio
    expected_language: Optional[str] = "en"
    context_aware: bool = True

class MCPSession(BaseModel):
    """Model for MCP user sessions"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    project_id: Optional[str] = None
    session_name: str = "Default Session"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    context: Dict[str, Any] = {}
    langchain_session_id: Optional[str] = None

class MCPProject(BaseModel):
    """Model for MCP projects"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None
    owner_id: str
    language: Optional[ProgrammingLanguage] = None
    framework: Optional[str] = None
    repository_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class MCPAnalytics(BaseModel):
    """Model for MCP analytics tracking"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    request_id: str
    task_type: MCPTaskType
    language: Optional[ProgrammingLanguage] = None
    success: bool
    response_time: float  # in seconds
    tokens_used: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Configuration models for various AI services
class GeminiConfig(BaseModel):
    """Configuration for Google Gemini integration"""
    api_key: str
    model_name: str = "gemini-2.5-flash"
    temperature: float = 0.7
    max_tokens: int = 8192
    top_p: float = 0.8
    top_k: int = 40

class LangChainConfig(BaseModel):
    """Configuration for LangChain integration"""
    chain_type: str = "conversational"
    memory_type: str = "conversation_buffer"
    max_memory_length: int = 10
    enable_tools: bool = True
    custom_tools: List[str] = []

class RivaConfig(BaseModel):
    """Configuration for NVIDIA Riva TTS"""
    server_url: str
    language_code: str = "en-US"
    voice_name: str = "English-US.Female-1"
    sample_rate: int = 22050
    audio_encoding: str = "LINEAR_PCM"

class MCPConfig(BaseModel):
    """Main configuration for MCP system"""
    gemini: GeminiConfig
    langchain: LangChainConfig
    riva: RivaConfig
    vector_db_url: str = "http://localhost:8000"
    max_concurrent_requests: int = 100
    default_timeout: int = 300  # seconds
    enable_voice: bool = True
    enable_multimodal: bool = True
    enable_analytics: bool = True
