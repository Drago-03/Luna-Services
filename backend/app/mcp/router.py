"""
Enhanced Universal Model Context Protocol (MCP) API Router

This module provides comprehensive REST API endpoints for the Universal MCP system,
enabling developers to access advanced AI-powered development tools through HTTP requests.
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, UploadFile, File
from fastapi.security import HTTPBearer
from fastapi.responses import StreamingResponse
from typing import Dict, List, Optional, Any
import asyncio
import logging
from datetime import datetime
import json

# Local imports
from .models import (
    MCPRequest, MCPResponse, MCPTaskType, ProgrammingLanguage,
    CodeGenerationRequest, DebuggingRequest, ArchitectureRequest,
    VoiceCommandRequest, MCPSession, MCPProject, MCPConfig,
    GeminiConfig, LangChainConfig, RivaConfig
)
from .service_enhanced import EnhancedMCPService
from ..auth.router import get_current_user

# Initialize router and logging
mcp_router = APIRouter()
security = HTTPBearer()
logger = logging.getLogger(__name__)

# Global enhanced MCP service instance
enhanced_mcp_service: Optional[EnhancedMCPService] = None

# Configuration for enhanced MCP service
def get_enhanced_mcp_config() -> MCPConfig:
    """Get enhanced MCP configuration from environment variables"""
    import os
    
    return MCPConfig(
        gemini=GeminiConfig(
            api_key=os.getenv("GEMINI_API_KEY", "your-gemini-api-key"),
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
            server_url=os.getenv("RIVA_SERVER_URL", "localhost:50051"),
            language_code=os.getenv("RIVA_LANGUAGE", "en-US"),
            voice_name=os.getenv("RIVA_VOICE", "English-US.Female-1"),
            sample_rate=int(os.getenv("RIVA_SAMPLE_RATE", "22050"))
        )
    )

def get_enhanced_mcp_service() -> EnhancedMCPService:
    """Get or create the enhanced MCP service instance"""
    global enhanced_mcp_service
    if enhanced_mcp_service is None:
        config = get_enhanced_mcp_config()
        enhanced_mcp_service = EnhancedMCPService(config)
    return enhanced_mcp_service

@mcp_router.post("/process", response_model=MCPResponse)
async def process_mcp_request(
    request: MCPRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user)
):
    """
    Process an enhanced MCP request with AI orchestration
    
    This endpoint handles various AI development tasks including:
    - Code generation and optimization
    - Debugging and error resolution
    - Architecture design and planning
    - Voice commands and multi-modal inputs
    - Documentation generation
    - Testing strategies
    """
    try:
        logger.info(f"Processing enhanced MCP request: {request.task_type} for user {request.user_id}")
        
        # Get the enhanced service
        service = get_enhanced_mcp_service()
        
        # Process the request
        response = await service.process_request(request)
        
        logger.info(f"Enhanced MCP request processed successfully: {response.status}")
        return response
        
    except Exception as e:
        logger.error(f"Error processing enhanced MCP request: {e}")
        return MCPResponse(
            request_id=request.id,
            status="error",
            error_message=str(e),
            completed_at=datetime.utcnow()
        )

@mcp_router.post("/process/stream")
async def stream_mcp_response(
    request: MCPRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Stream MCP response for real-time interaction
    """
    try:
        service = get_enhanced_mcp_service()
        
        async def generate_stream():
            async for chunk in service.gemini_service.stream_response(request):
                yield f"data: {json.dumps({'chunk': chunk})}\n\n"
            yield f"data: {json.dumps({'done': True})}\n\n"
        
        return StreamingResponse(
            generate_stream(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            }
        )
        
    except Exception as e:
        logger.error(f"Error streaming MCP response: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@mcp_router.post("/voice/process", response_model=MCPResponse)
async def process_voice_command(
    request: VoiceCommandRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Process voice commands with speech recognition and synthesis
    """
    try:
        logger.info(f"Processing voice command for user {request.user_id}")
        
        service = get_enhanced_mcp_service()
        response = await service.riva_service.process_voice_command(request)
        
        return response
        
    except Exception as e:
        logger.error(f"Error processing voice command: {e}")
        return MCPResponse(
            request_id=request.id,
            status="error",
            error_message=str(e),
            completed_at=datetime.utcnow()
        )

@mcp_router.post("/session/create", response_model=MCPSession)
async def create_enhanced_session(
    user_id: str,
    project_id: Optional[str] = None,
    session_name: str = "Enhanced MCP Session",
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new enhanced MCP session with conversation memory
    """
    try:
        service = get_enhanced_mcp_service()
        session = await service.create_session(user_id, project_id, session_name)
        
        logger.info(f"Created enhanced session {session.id} for user {user_id}")
        return session
        
    except Exception as e:
        logger.error(f"Error creating enhanced session: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@mcp_router.post("/session/{session_id}/continue")
async def continue_conversation(
    session_id: str,
    message: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Continue a conversation in an existing session
    """
    try:
        service = get_enhanced_mcp_service()
        response = await service.continue_conversation(session_id, message)
        
        return {"session_id": session_id, "response": response}
        
    except Exception as e:
        logger.error(f"Error continuing conversation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@mcp_router.get("/analytics/session/{session_id}")
async def get_session_analytics(
    session_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get comprehensive analytics for an MCP session
    """
    try:
        service = get_enhanced_mcp_service()
        analytics = await service.get_session_analytics(session_id)
        
        return analytics
        
    except Exception as e:
        logger.error(f"Error getting session analytics: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@mcp_router.get("/health")
async def enhanced_health_check():
    """
    Comprehensive health check for all enhanced MCP services
    """
    try:
        service = get_enhanced_mcp_service()
        health_status = await service.health_check()
        
        return health_status
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "service": "Enhanced MCP Service",
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

@mcp_router.get("/capabilities")
async def get_mcp_capabilities():
    """
    Get available MCP capabilities and supported features
    """
    return {
        "task_types": [task_type.value for task_type in MCPTaskType],
        "programming_languages": [lang.value for lang in ProgrammingLanguage],
        "features": {
            "voice_synthesis": True,
            "speech_recognition": True,
            "multi_modal_input": True,
            "real_time_streaming": True,
            "conversation_memory": True,
            "code_execution": False,  # Future feature
            "collaborative_editing": False,  # Future feature
        },
        "ai_models": {
            "primary_llm": "Google Gemini 2.5 Flash",
            "langchain_framework": "Enabled",
            "voice_synthesis": "NVIDIA Riva TTS",
            "speech_recognition": "NVIDIA Riva ASR"
        }
    }

@mcp_router.get("/templates")
async def get_request_templates():
    """
    Get pre-built request templates for common development tasks
    """
    return {
        "code_generation": {
            "python_function": {
                "task_type": "code_generation",
                "language": "python",
                "prompt": "Create a Python function that calculates the factorial of a number",
                "context": {"include_tests": True, "include_docstring": True}
            },
            "react_component": {
                "task_type": "code_generation", 
                "language": "typescript",
                "prompt": "Create a React TypeScript component for a user profile card",
                "context": {"include_props_interface": True, "styling": "chakra-ui"}
            }
        },
        "debugging": {
            "python_error": {
                "task_type": "debugging",
                "language": "python",
                "prompt": "Help me debug this Python error",
                "context": {"include_stack_trace": True, "suggest_fixes": True}
            }
        },
        "architecture": {
            "microservices": {
                "task_type": "architecture_design",
                "prompt": "Design a microservices architecture for an e-commerce platform",
                "context": {"include_database_design": True, "include_api_design": True}
            }
        }
    }

@mcp_router.post("/workflow/analyze")
async def analyze_development_workflow(
    files: List[UploadFile] = File(...),
    analysis_type: str = "comprehensive",
    current_user: dict = Depends(get_current_user)
):
    """
    Analyze development workflow from uploaded project files
    """
    try:
        service = get_enhanced_mcp_service()
        
        # Process uploaded files
        file_contents = []
        for file in files:
            content = await file.read()
            file_contents.append({
                "name": file.filename,
                "content": content.decode('utf-8') if content else "",
                "size": len(content)
            })
        
        # Create analysis request
        request = MCPRequest(
            task_type=MCPTaskType.WORKFLOW_AUTOMATION,
            user_id=current_user.get("user_id", "anonymous"),
            prompt=f"Analyze this project structure and provide {analysis_type} workflow recommendations",
            files=file_contents,
            context={"analysis_type": analysis_type}
        )
        
        response = await service.process_request(request)
        return response
        
    except Exception as e:
        logger.error(f"Error analyzing workflow: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@mcp_router.get("/models/status")
async def get_ai_models_status():
    """
    Get status and performance metrics for all AI models
    """
    try:
        service = get_enhanced_mcp_service()
        
        return {
            "gemini": {
                "status": "operational",
                "model": service.config.gemini.model_name,
                "temperature": service.config.gemini.temperature,
                "max_tokens": service.config.gemini.max_tokens
            },
            "langchain": {
                "status": "operational", 
                "active_sessions": len(service.langchain_service.sessions) if service.langchain_service else 0,
                "memory_type": service.config.langchain.memory_type
            },
            "riva": {
                "status": "operational" if service.riva_service.is_available else "degraded",
                "server_url": service.config.riva.server_url,
                "voice_enabled": service.riva_service.is_available
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting models status: {e}")
        raise HTTPException(status_code=500, detail=str(e))
            server_url=os.getenv("RIVA_SERVER_URL", "http://localhost:50051"),
            language_code=os.getenv("RIVA_LANGUAGE", "en-US"),
            voice_name=os.getenv("RIVA_VOICE", "English-US.Female-1")
        ),
        vector_db_url=os.getenv("VECTOR_DB_URL", "http://localhost:8000"),
        max_concurrent_requests=int(os.getenv("MCP_MAX_CONCURRENT", "100")),
        enable_voice=os.getenv("MCP_ENABLE_VOICE", "true").lower() == "true",
        enable_multimodal=os.getenv("MCP_ENABLE_MULTIMODAL", "true").lower() == "true",
        enable_analytics=os.getenv("MCP_ENABLE_ANALYTICS", "true").lower() == "true"
    )

async def get_mcp_service() -> MCPService:
    """Dependency to get MCP service instance"""
    global mcp_service
    if mcp_service is None:
        config = get_mcp_config()
        mcp_service = MCPService(config)
    return mcp_service

# ============================================================================
# Session Management Endpoints
# ============================================================================

@mcp_router.post("/sessions", response_model=MCPSession)
async def create_mcp_session(
    project_id: Optional[str] = None,
    session_name: str = "Default Session",
    current_user: dict = Depends(get_current_user),
    service: MCPService = Depends(get_mcp_service)
):
    """
    Create a new MCP session for AI-assisted development.
    
    Sessions maintain context and conversation history for better AI responses.
    """
    try:
        session = await service.create_session(
            user_id=current_user["id"],
            project_id=project_id,
            session_name=session_name
        )
        return session
    except Exception as e:
        logger.error(f"Failed to create MCP session: {e}")
        raise HTTPException(status_code=500, detail="Failed to create session")

@mcp_router.get("/sessions/{session_id}", response_model=MCPSession)
async def get_mcp_session(
    session_id: str,
    current_user: dict = Depends(get_current_user),
    service: MCPService = Depends(get_mcp_service)
):
    """Get details of a specific MCP session"""
    session = await service.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if session.user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return session

@mcp_router.get("/sessions", response_model=List[MCPSession])
async def list_user_sessions(
    current_user: dict = Depends(get_current_user),
    service: MCPService = Depends(get_mcp_service)
):
    """List all sessions for the current user"""
    user_sessions = [
        session for session in service.sessions.values()
        if session.user_id == current_user["id"] and session.is_active
    ]
    return user_sessions

# ============================================================================
# Core AI Processing Endpoints
# ============================================================================

@mcp_router.post("/generate", response_model=MCPResponse)
async def generate_code(
    request: CodeGenerationRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
    service: MCPService = Depends(get_mcp_service)
):
    """
    Generate code using AI based on natural language requirements.
    
    Supports multiple programming languages and includes best practices,
    error handling, and comprehensive documentation.
    """
    try:
        # Set user ID from authenticated user
        request.user_id = current_user["id"]
        
        # Process the request
        response = await service.process_request(request)
        
        # Add background task for analytics processing
        background_tasks.add_task(
            _process_analytics,
            request.dict(),
            response.dict(),
            current_user["id"]
        )
        
        return response
    except Exception as e:
        logger.error(f"Code generation failed: {e}")
        raise HTTPException(status_code=500, detail="Code generation failed")

@mcp_router.post("/debug", response_model=MCPResponse)
async def debug_code(
    request: DebuggingRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
    service: MCPService = Depends(get_mcp_service)
):
    """
    Debug code issues using AI-powered analysis.
    
    Provides root cause analysis, step-by-step solutions,
    and prevention strategies for code problems.
    """
    try:
        request.user_id = current_user["id"]
        response = await service.process_request(request)
        
        background_tasks.add_task(
            _process_analytics,
            request.dict(),
            response.dict(),
            current_user["id"]
        )
        
        return response
    except Exception as e:
        logger.error(f"Debugging failed: {e}")
        raise HTTPException(status_code=500, detail="Debugging failed")

@mcp_router.post("/architect", response_model=MCPResponse)
async def design_architecture(
    request: ArchitectureRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
    service: MCPService = Depends(get_mcp_service)
):
    """
    Design software architecture using AI assistance.
    
    Provides high-level architecture diagrams, component breakdowns,
    technology recommendations, and scalability considerations.
    """
    try:
        request.user_id = current_user["id"]
        response = await service.process_request(request)
        
        background_tasks.add_task(
            _process_analytics,
            request.dict(),
            response.dict(),
            current_user["id"]
        )
        
        return response
    except Exception as e:
        logger.error(f"Architecture design failed: {e}")
        raise HTTPException(status_code=500, detail="Architecture design failed")

@mcp_router.post("/voice", response_model=MCPResponse)
async def process_voice_command(
    request: VoiceCommandRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
    service: MCPService = Depends(get_mcp_service)
):
    """
    Process voice commands for AI-assisted development.
    
    Supports speech-to-text processing and returns both text
    and optional voice responses for hands-free development.
    """
    try:
        request.user_id = current_user["id"]
        response = await service.process_request(request)
        
        background_tasks.add_task(
            _process_analytics,
            request.dict(),
            response.dict(),
            current_user["id"]
        )
        
        return response
    except Exception as e:
        logger.error(f"Voice command processing failed: {e}")
        raise HTTPException(status_code=500, detail="Voice command processing failed")

@mcp_router.post("/process", response_model=MCPResponse)
async def process_general_request(
    request: MCPRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user),
    service: MCPService = Depends(get_mcp_service)
):
    """
    Process general AI assistance requests.
    
    Handles various development tasks including API integration,
    documentation generation, testing, and general programming help.
    """
    try:
        request.user_id = current_user["id"]
        response = await service.process_request(request)
        
        background_tasks.add_task(
            _process_analytics,
            request.dict(),
            response.dict(),
            current_user["id"]
        )
        
        return response
    except Exception as e:
        logger.error(f"Request processing failed: {e}")
        raise HTTPException(status_code=500, detail="Request processing failed")

# ============================================================================
# File Upload and Multi-modal Endpoints
# ============================================================================

@mcp_router.post("/upload/analyze", response_model=MCPResponse)
async def analyze_uploaded_files(
    files: List[UploadFile] = File(...),
    task_type: MCPTaskType = MCPTaskType.CODE_GENERATION,
    prompt: str = "Analyze the uploaded files",
    current_user: dict = Depends(get_current_user),
    service: MCPService = Depends(get_mcp_service)
):
    """
    Analyze uploaded files using AI.
    
    Supports code review, documentation generation,
    and multi-file analysis for comprehensive insights.
    """
    try:
        # Process uploaded files
        file_contents = []
        for file in files:
            content = await file.read()
            file_contents.append({
                "filename": file.filename,
                "content": content.decode('utf-8', errors='ignore'),
                "size": len(content)
            })
        
        # Create request with file contents
        request = MCPRequest(
            task_type=task_type,
            user_id=current_user["id"],
            prompt=prompt,
            files=file_contents
        )
        
        response = await service.process_request(request)
        return response
        
    except Exception as e:
        logger.error(f"File analysis failed: {e}")
        raise HTTPException(status_code=500, detail="File analysis failed")

# ============================================================================
# Analytics and Monitoring Endpoints
# ============================================================================

@mcp_router.get("/analytics/user", response_model=Dict[str, Any])
async def get_user_analytics(
    days: int = 30,
    current_user: dict = Depends(get_current_user),
    service: MCPService = Depends(get_mcp_service)
):
    """
    Get analytics data for the current user.
    
    Includes usage statistics, success rates, and performance metrics
    for the specified time period.
    """
    try:
        analytics = await service.get_user_analytics(
            user_id=current_user["id"],
            days=days
        )
        return analytics
    except Exception as e:
        logger.error(f"Failed to get user analytics: {e}")
        raise HTTPException(status_code=500, detail="Failed to get analytics")

@mcp_router.get("/status", response_model=Dict[str, Any])
async def get_mcp_status(
    service: MCPService = Depends(get_mcp_service)
):
    """
    Get current status of the MCP system.
    
    Includes active sessions, processing queue status,
    and system health information.
    """
    try:
        status = {
            "status": "operational",
            "active_sessions": len(service.sessions),
            "active_requests": len(service.active_requests),
            "features": {
                "voice_enabled": service.config.enable_voice,
                "multimodal_enabled": service.config.enable_multimodal,
                "analytics_enabled": service.config.enable_analytics
            },
            "models": {
                "primary_llm": service.config.gemini.model_name,
                "voice_synthesis": "NVIDIA Riva TTS",
                "framework": "LangChain"
            },
            "timestamp": datetime.utcnow().isoformat()
        }
        return status
    except Exception as e:
        logger.error(f"Failed to get MCP status: {e}")
        raise HTTPException(status_code=500, detail="Failed to get status")

# ============================================================================
# Configuration and System Management
# ============================================================================

@mcp_router.get("/languages", response_model=List[str])
async def get_supported_languages():
    """Get list of supported programming languages"""
    return [lang.value for lang in ProgrammingLanguage]

@mcp_router.get("/task-types", response_model=List[str])
async def get_supported_task_types():
    """Get list of supported MCP task types"""
    return [task.value for task in MCPTaskType]

@mcp_router.post("/config/validate")
async def validate_mcp_config(
    config: MCPConfig,
    current_user: dict = Depends(get_current_user)
):
    """
    Validate MCP configuration settings.
    
    Checks API keys, service connectivity, and configuration validity.
    """
    try:
        # Validate configuration (would include actual API key validation)
        validation_results = {
            "gemini_api_key": bool(config.gemini.api_key and len(config.gemini.api_key) > 10),
            "riva_server": bool(config.riva.server_url),
            "vector_db": bool(config.vector_db_url),
            "langchain_config": True  # Placeholder validation
        }
        
        all_valid = all(validation_results.values())
        
        return {
            "valid": all_valid,
            "checks": validation_results,
            "recommendations": _get_config_recommendations(validation_results)
        }
    except Exception as e:
        logger.error(f"Configuration validation failed: {e}")
        raise HTTPException(status_code=500, detail="Configuration validation failed")

# ============================================================================
# Helper Functions
# ============================================================================

async def _process_analytics(request_data: dict, response_data: dict, user_id: str):
    """Background task for processing analytics data"""
    try:
        # Process analytics in background
        logger.info(f"Processing analytics for user {user_id}")
        # Could send to external analytics service, update databases, etc.
    except Exception as e:
        logger.error(f"Analytics processing failed: {e}")

def _get_config_recommendations(validation_results: dict) -> List[str]:
    """Get configuration improvement recommendations"""
    recommendations = []
    
    if not validation_results.get("gemini_api_key"):
        recommendations.append("Set up valid Google Gemini API key for AI processing")
    
    if not validation_results.get("riva_server"):
        recommendations.append("Configure NVIDIA Riva server for voice synthesis")
    
    if not validation_results.get("vector_db"):
        recommendations.append("Set up vector database for semantic search capabilities")
    
    return recommendations

# ============================================================================
# WebSocket Endpoints for Real-time Communication
# ============================================================================

@mcp_router.websocket("/ws/{session_id}")
async def websocket_endpoint(
    websocket,  # WebSocket type would be imported from fastapi
    session_id: str,
    service: MCPService = Depends(get_mcp_service)
):
    """
    WebSocket endpoint for real-time MCP communication.
    
    Enables real-time AI assistance, live code generation,
    and interactive development sessions.
    """
    try:
        await websocket.accept()
        
        # Get session
        session = await service.get_session(session_id)
        if not session:
            await websocket.close(code=4004, reason="Session not found")
            return
        
        logger.info(f"WebSocket connected for session {session_id}")
        
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            
            # Process MCP request
            request = MCPRequest(**data)
            request.user_id = session.user_id
            
            # Send processing status
            await websocket.send_json({
                "type": "status",
                "message": "Processing request...",
                "request_id": request.id
            })
            
            # Process request
            response = await service.process_request(request)
            
            # Send response
            await websocket.send_json({
                "type": "response",
                "data": response.dict(),
                "request_id": request.id
            })
            
    except Exception as e:
        logger.error(f"WebSocket error for session {session_id}: {e}")
        await websocket.close(code=4000, reason="Internal server error")
