"""
Enhanced MCP Core Service Implementation

This module provides the advanced business logic for the Universal MCP system,
orchestrating Google Gemini 2.5, LangChain workflows, NVIDIA Riva TTS, and 
comprehensive AI development assistance capabilities.
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any, Union
from datetime import datetime, timedelta
import json
import uuid

# Local imports
from .models import (
    MCPRequest, MCPResponse, MCPTaskType, ProgrammingLanguage,
    CodeGenerationRequest, DebuggingRequest, ArchitectureRequest,
    VoiceCommandRequest, MCPSession, MCPProject, MCPAnalytics,
    GeminiConfig, LangChainConfig, RivaConfig, MCPConfig
)

logger = logging.getLogger(__name__)

class EnhancedMCPService:
    """
    Enhanced Universal Model Context Protocol service with advanced AI integrations.
    
    This service orchestrates multiple AI services to provide comprehensive
    development assistance including code generation, debugging, architecture
    design, voice interaction, and multi-modal capabilities.
    """
    
    def __init__(self, config: MCPConfig):
        """Initialize the enhanced MCP service with all AI integrations"""
        self.config = config
        self.sessions: Dict[str, MCPSession] = {}
        self.active_requests: Dict[str, MCPRequest] = {}
        self.analytics: List[MCPAnalytics] = []
        
        # Initialize AI services
        self._initialize_ai_services()
        
        # Task routing map
        self.task_routes = {
            MCPTaskType.CODE_GENERATION: self._handle_code_generation,
            MCPTaskType.CODE_OPTIMIZATION: self._handle_code_optimization,
            MCPTaskType.DEBUGGING: self._handle_debugging,
            MCPTaskType.ARCHITECTURE_DESIGN: self._handle_architecture_design,
            MCPTaskType.API_INTEGRATION: self._handle_api_integration,
            MCPTaskType.DOCUMENTATION: self._handle_documentation,
            MCPTaskType.TESTING: self._handle_testing,
            MCPTaskType.VOICE_COMMAND: self._handle_voice_command,
            MCPTaskType.MULTI_MODAL: self._handle_multi_modal,
            MCPTaskType.WORKFLOW_AUTOMATION: self._handle_workflow_automation,
        }
        
        logger.info("Enhanced MCP Service initialized successfully")
    
    def _initialize_ai_services(self):
        """Initialize all AI service integrations"""
        try:
            # Import AI services here to avoid circular imports
            from .integrations.gemini_enhanced import EnhancedGeminiService
            from .integrations.langchain_enhanced import EnhancedLangChainService
            
            # Initialize Enhanced Gemini Service
            self.gemini_service = EnhancedGeminiService(self.config.gemini)
            logger.info("Enhanced Gemini service initialized")
            
            # Initialize Enhanced LangChain Service
            self.langchain_service = EnhancedLangChainService(
                self.config.langchain,
                self.config.gemini.api_key
            )
            logger.info("Enhanced LangChain service initialized")
            
            # Initialize Enhanced Riva Service (optional for AutoMCP compatibility)
            try:
                from .integrations.riva_enhanced import EnhancedRivaService
                self.riva_service = EnhancedRivaService(self.config.riva)
                logger.info("Enhanced Riva service initialized")
            except ImportError as e:
                logger.warning(f"Riva service not available (missing dependencies): {e}")
                self.riva_service = None
            except Exception as e:
                logger.warning(f"Failed to initialize Riva service: {e}")
                self.riva_service = None
            
        except Exception as e:
            logger.error(f"Failed to initialize AI services: {e}")
            raise
    
    async def process_request(self, request: MCPRequest) -> MCPResponse:
        """
        Process an MCP request using the appropriate AI service combination
        """
        try:
            # Store active request
            self.active_requests[request.id] = request
            
            # Route to appropriate handler
            if request.task_type in self.task_routes:
                handler = self.task_routes[request.task_type]
                response = await handler(request)
            else:
                response = await self._handle_generic_request(request)
            
            # Add voice output if requested
            if request.metadata and request.metadata.get("include_voice", False):
                if response.explanation and not response.voice_output and self.riva_service:
                    response.voice_output = await self.riva_service.create_audio_response(
                        response.explanation, 
                        str(request.task_type.value)
                    )
            
            # Update analytics
            await self._record_analytics(request, response)
            
            # Clean up
            if request.id in self.active_requests:
                del self.active_requests[request.id]
            
            return response
            
        except Exception as e:
            logger.error(f"Error processing MCP request {request.id}: {e}")
            return MCPResponse(
                request_id=request.id,
                status="error",
                error_message=str(e),
                completed_at=datetime.utcnow()
            )
    
    async def _handle_code_generation(self, request: CodeGenerationRequest) -> MCPResponse:
        """Handle code generation requests with enhanced capabilities"""
        try:
            # Use LangChain for complex code analysis workflow if needed
            if request.context and len(request.context) > 3:
                # Complex request - use LangChain workflow
                workflow_result = await self.langchain_service.process_workflow(
                    request, "code_analysis"
                )
                
                # Enhance with Gemini for final code generation
                enhanced_request = MCPRequest(
                    task_type=MCPTaskType.CODE_GENERATION,
                    user_id=request.user_id,
                    prompt=f"Based on analysis: {workflow_result['result']}\n\nGenerate: {request.prompt}",
                    language=request.language,
                    context=request.context
                )
                return await self.gemini_service.process_request(enhanced_request)
            else:
                # Simple request - direct Gemini processing
                return await self.gemini_service.process_request(request)
                
        except Exception as e:
            logger.error(f"Error in code generation: {e}")
            raise
    
    async def _handle_code_optimization(self, request: MCPRequest) -> MCPResponse:
        """Handle code optimization requests"""
        try:
            # Use LangChain for detailed code analysis
            workflow_result = await self.langchain_service.process_workflow(
                request, "code_analysis"
            )
            
            # Enhance with Gemini for optimization suggestions
            optimization_request = MCPRequest(
                task_type=MCPTaskType.CODE_OPTIMIZATION,
                user_id=request.user_id,
                prompt=f"Optimize based on analysis: {workflow_result['result']}\n\nOriginal request: {request.prompt}",
                language=request.language,
                context=request.context
            )
            
            return await self.gemini_service.process_request(optimization_request)
            
        except Exception as e:
            logger.error(f"Error in code optimization: {e}")
            raise
    
    async def _handle_debugging(self, request: DebuggingRequest) -> MCPResponse:
        """Handle debugging requests with systematic approach"""
        try:
            # Use LangChain debugging workflow for systematic analysis
            workflow_result = await self.langchain_service.process_workflow(
                request, "debugging"
            )
            
            # Enhance with Gemini for final solution
            debug_request = MCPRequest(
                task_type=MCPTaskType.DEBUGGING,
                user_id=request.user_id,
                prompt=f"Complete debugging based on analysis: {workflow_result['result']}",
                language=request.language,
                context={
                    **(request.context or {}),
                    "error_message": request.error_message,
                    "stack_trace": request.stack_trace,
                    "code_snippet": request.code_snippet
                }
            )
            
            return await self.gemini_service.process_request(debug_request)
            
        except Exception as e:
            logger.error(f"Error in debugging: {e}")
            raise
    
    async def _handle_architecture_design(self, request: ArchitectureRequest) -> MCPResponse:
        """Handle architecture design requests"""
        try:
            # Use LangChain for comprehensive architecture planning
            workflow_result = await self.langchain_service.process_workflow(
                request, "architecture_planning"
            )
            
            # Enhance with Gemini for detailed implementation guidance
            arch_request = MCPRequest(
                task_type=MCPTaskType.ARCHITECTURE_DESIGN,
                user_id=request.user_id,
                prompt=f"Provide detailed architecture implementation based on: {workflow_result['result']}",
                context=request.context
            )
            
            return await self.gemini_service.process_request(arch_request)
            
        except Exception as e:
            logger.error(f"Error in architecture design: {e}")
            raise
    
    async def _handle_api_integration(self, request: MCPRequest) -> MCPResponse:
        """Handle API integration requests"""
        try:
            # Direct Gemini processing with API-specific prompting
            return await self.gemini_service.process_request(request)
            
        except Exception as e:
            logger.error(f"Error in API integration: {e}")
            raise
    
    async def _handle_documentation(self, request: MCPRequest) -> MCPResponse:
        """Handle documentation generation requests"""
        try:
            # Use LangChain documentation workflow
            workflow_result = await self.langchain_service.process_workflow(
                request, "documentation"
            )
            
            response = MCPResponse(
                request_id=request.id,
                status="success",
                result={"documentation": workflow_result["result"]},
                explanation=workflow_result["result"],
                completed_at=datetime.utcnow()
            )
            
            return response
            
        except Exception as e:
            logger.error(f"Error in documentation: {e}")
            raise
    
    async def _handle_testing(self, request: MCPRequest) -> MCPResponse:
        """Handle testing strategy and test generation requests"""
        try:
            # Use LangChain testing strategy workflow
            workflow_result = await self.langchain_service.process_workflow(
                request, "testing_strategy"
            )
            
            # Enhance with Gemini for specific test code generation
            test_request = MCPRequest(
                task_type=MCPTaskType.TESTING,
                user_id=request.user_id,
                prompt=f"Generate test code based on strategy: {workflow_result['result']}\n\nOriginal request: {request.prompt}",
                language=request.language,
                context=request.context
            )
            
            return await self.gemini_service.process_request(test_request)
            
        except Exception as e:
            logger.error(f"Error in testing: {e}")
            raise
    
    async def _handle_voice_command(self, request: VoiceCommandRequest) -> MCPResponse:
        """Handle voice command processing"""
        if not self.riva_service:
            return MCPResponse(
                request_id=request.id,
                status="error",
                error_message="Voice processing not available (Riva service not initialized)",
                completed_at=datetime.utcnow()
            )
        return await self.riva_service.process_voice_command(request)
    
    async def _handle_multi_modal(self, request: MCPRequest) -> MCPResponse:
        """Handle multi-modal requests (text + image/voice)"""
        try:
            # Process with Gemini for multi-modal capabilities
            response = await self.gemini_service.process_request(request)
            
            # Add voice output if requested
            if response.explanation and self.riva_service:
                voice_output = await self.riva_service.create_audio_response(
                    response.explanation,
                    "explanation"
                )
                response.voice_output = voice_output
            
            return response
            
        except Exception as e:
            logger.error(f"Error in multi-modal processing: {e}")
            raise
    
    async def _handle_workflow_automation(self, request: MCPRequest) -> MCPResponse:
        """Handle workflow automation requests"""
        try:
            # Use LangChain for workflow analysis and planning
            workflow_result = await self.langchain_service.process_workflow(
                request, "architecture_planning"  # Reuse for workflow planning
            )
            
            # Enhance with Gemini for specific automation code
            automation_request = MCPRequest(
                task_type=MCPTaskType.WORKFLOW_AUTOMATION,
                user_id=request.user_id,
                prompt=f"Generate automation code based on workflow: {workflow_result['result']}",
                language=request.language,
                context=request.context
            )
            
            return await self.gemini_service.process_request(automation_request)
            
        except Exception as e:
            logger.error(f"Error in workflow automation: {e}")
            raise
    
    async def _handle_generic_request(self, request: MCPRequest) -> MCPResponse:
        """Handle generic requests that don't fit specific categories"""
        try:
            return await self.gemini_service.process_request(request)
            
        except Exception as e:
            logger.error(f"Error in generic request: {e}")
            raise
    
    async def create_session(self, user_id: str, project_id: Optional[str] = None,
                           session_name: str = "Enhanced MCP Session") -> MCPSession:
        """Create a new enhanced MCP session"""
        try:
            session = MCPSession(
                user_id=user_id,
                project_id=project_id,
                session_name=session_name
            )
            
            # Create LangChain conversation session
            langchain_session_id = await self.langchain_service.create_conversation_session(
                user_id, project_id
            )
            session.langchain_session_id = langchain_session_id
            
            self.sessions[session.id] = session
            
            logger.info(f"Created enhanced MCP session {session.id} for user {user_id}")
            return session
            
        except Exception as e:
            logger.error(f"Error creating session: {e}")
            raise
    
    async def continue_conversation(self, session_id: str, message: str) -> str:
        """Continue a conversation in an existing session"""
        try:
            if session_id not in self.sessions:
                raise ValueError(f"Session {session_id} not found")
            
            session = self.sessions[session_id]
            
            # Use LangChain for conversation continuity
            if hasattr(session, 'langchain_session_id') and session.langchain_session_id:
                response = await self.langchain_service.continue_conversation(
                    session.langchain_session_id, message
                )
            else:
                # Fallback to direct processing
                request = MCPRequest(
                    task_type=MCPTaskType.CODE_GENERATION,
                    user_id=session.user_id,
                    prompt=message
                )
                mcp_response = await self.gemini_service.process_request(request)
                response = mcp_response.explanation or "I'm here to help with your development needs."
            
            return response
            
        except Exception as e:
            logger.error(f"Error continuing conversation: {e}")
            raise
    
    async def get_session_analytics(self, session_id: str) -> Dict[str, Any]:
        """Get analytics for a specific session"""
        try:
            if session_id not in self.sessions:
                return {}
            
            session = self.sessions[session_id]
            session_analytics = [a for a in self.analytics if a.session_id == session_id]
            
            return {
                "session_id": session_id,
                "user_id": session.user_id,
                "total_requests": len(session_analytics),
                "task_distribution": self._calculate_task_distribution(session_analytics),
                "avg_response_time": self._calculate_avg_response_time(session_analytics),
                "success_rate": self._calculate_success_rate(session_analytics)
            }
            
        except Exception as e:
            logger.error(f"Error getting session analytics: {e}")
            return {}
    
    async def _record_analytics(self, request: MCPRequest, response: MCPResponse):
        """Record analytics for request/response pair"""
        try:
            analytics = MCPAnalytics(
                session_id=request.user_id,  # Using user_id as session identifier
                request_id=request.id,
                task_type=request.task_type,
                language=request.language,
                success=response.status == "success",
                response_time=response.execution_time or 0,
                tokens_used=response.tokens_used or 0,
                created_at=datetime.utcnow()
            )
            
            self.analytics.append(analytics)
            
        except Exception as e:
            logger.error(f"Error recording analytics: {e}")
    
    def _calculate_task_distribution(self, analytics: List[MCPAnalytics]) -> Dict[str, int]:
        """Calculate task type distribution"""
        distribution = {}
        for analytic in analytics:
            task_type = analytic.task_type.value
            distribution[task_type] = distribution.get(task_type, 0) + 1
        return distribution
    
    def _calculate_avg_response_time(self, analytics: List[MCPAnalytics]) -> float:
        """Calculate average response time"""
        if not analytics:
            return 0.0
        
        total_time = sum(a.response_time for a in analytics)
        return total_time / len(analytics)
    
    def _calculate_success_rate(self, analytics: List[MCPAnalytics]) -> float:
        """Calculate success rate"""
        if not analytics:
            return 0.0
        
        successful = sum(1 for a in analytics if a.success)
        return successful / len(analytics) * 100
    
    async def health_check(self) -> Dict[str, Any]:
        """Comprehensive health check for all services"""
        try:
            health_status = {
                "service": "Enhanced MCP Service",
                "status": "healthy",
                "timestamp": datetime.utcnow().isoformat(),
                "components": {}
            }
            
            # Check Gemini service
            try:
                # Simple test request
                test_request = MCPRequest(
                    task_type=MCPTaskType.CODE_GENERATION,
                    user_id="health_check",
                    prompt="print('hello')",
                    language=ProgrammingLanguage.PYTHON
                )
                response = await self.gemini_service.process_request(test_request)
                health_status["components"]["gemini"] = {
                    "status": "healthy" if response.status == "success" else "degraded",
                    "response_time": response.execution_time
                }
            except Exception as e:
                health_status["components"]["gemini"] = {
                    "status": "unhealthy",
                    "error": str(e)
                }
            
            # Check Riva service
            if self.riva_service:
                riva_health = await self.riva_service.health_check()
                health_status["components"]["riva"] = riva_health
            else:
                health_status["components"]["riva"] = {
                    "status": "unavailable",
                    "message": "Riva service not initialized"
                }
            
            # Check LangChain service
            health_status["components"]["langchain"] = {
                "status": "healthy" if self.langchain_service else "unhealthy",
                "active_sessions": len(self.langchain_service.sessions) if self.langchain_service else 0
            }
            
            # Overall status
            component_statuses = [comp.get("status") for comp in health_status["components"].values()]
            if all(status == "healthy" for status in component_statuses):
                health_status["status"] = "healthy"
            elif any(status == "unhealthy" for status in component_statuses):
                health_status["status"] = "degraded"
            else:
                health_status["status"] = "healthy"
            
            return health_status
            
        except Exception as e:
            logger.error(f"Error in health check: {e}")
            return {
                "service": "Enhanced MCP Service",
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
