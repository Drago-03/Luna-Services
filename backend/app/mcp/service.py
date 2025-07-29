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
from .integrations.gemini_enhanced import EnhancedGeminiService
from .integrations.langchain_enhanced import EnhancedLangChainService
from .integrations.riva_enhanced import EnhancedRivaService

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
            # Initialize Enhanced Gemini Service
            self.gemini_service = EnhancedGeminiService(self.config.gemini)
            logger.info("Enhanced Gemini service initialized")
            
            # Initialize Enhanced LangChain Service
            self.langchain_service = EnhancedLangChainService(
                self.config.langchain,
                self.config.gemini.api_key
            )
            logger.info("Enhanced LangChain service initialized")
            
            # Initialize Enhanced Riva Service
            self.riva_service = EnhancedRivaService(self.config.riva)
            logger.info("Enhanced Riva service initialized")
            
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
                if response.explanation and not response.voice_output:
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
                    **request.context,
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
        """Handle voice command requests"""
        try:
            return await self.riva_service.process_voice_command(request)
            
        except Exception as e:
            logger.error(f"Error in voice command: {e}")
            raise
    
    async def _handle_multi_modal(self, request: MCPRequest) -> MCPResponse:
        """Handle multi-modal requests (text + image/voice)"""
        try:
            # Process with Gemini for multi-modal capabilities
            response = await self.gemini_service.process_request(request)
            
            # Add voice output if requested
            if response.explanation:
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
            if hasattr(session, 'langchain_session_id'):
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
            riva_health = await self.riva_service.health_check()
            health_status["components"]["riva"] = riva_health
            
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
        self.sessions[session.id] = session
        logger.info(f"Created new MCP session {session.id} for user {user_id}")
        return session
    
    async def get_session(self, session_id: str) -> Optional[MCPSession]:
        """Retrieve an existing MCP session"""
        session = self.sessions.get(session_id)
        if session:
            session.last_activity = datetime.utcnow()
        return session
    
    async def process_request(self, request: MCPRequest) -> MCPResponse:
        """
        Main entry point for processing MCP requests.
        
        Routes requests to appropriate handlers based on task type.
        """
        start_time = datetime.utcnow()
        self.active_requests[request.id] = request
        
        try:
            # Route to appropriate handler
            if request.task_type == MCPTaskType.CODE_GENERATION:
                response = await self._handle_code_generation(request)
            elif request.task_type == MCPTaskType.DEBUGGING:
                response = await self._handle_debugging(request)
            elif request.task_type == MCPTaskType.ARCHITECTURE_DESIGN:
                response = await self._handle_architecture_design(request)
            elif request.task_type == MCPTaskType.VOICE_COMMAND:
                response = await self._handle_voice_command(request)
            elif request.task_type == MCPTaskType.API_INTEGRATION:
                response = await self._handle_api_integration(request)
            elif request.task_type == MCPTaskType.DOCUMENTATION:
                response = await self._handle_documentation(request)
            elif request.task_type == MCPTaskType.TESTING:
                response = await self._handle_testing(request)
            else:
                response = await self._handle_general_request(request)
            
            # Calculate execution time
            execution_time = (datetime.utcnow() - start_time).total_seconds()
            response.execution_time = execution_time
            response.completed_at = datetime.utcnow()
            
            # Track analytics
            await self._track_analytics(request, response, execution_time)
            
            logger.info(f"Completed request {request.id} in {execution_time:.2f}s")
            return response
            
        except Exception as e:
            logger.error(f"Error processing request {request.id}: {e}")
            execution_time = (datetime.utcnow() - start_time).total_seconds()
            
            # Create error response
            error_response = MCPResponse(
                request_id=request.id,
                status="error",
                error_message=str(e),
                execution_time=execution_time,
                completed_at=datetime.utcnow()
            )
            
            # Track error analytics
            await self._track_analytics(request, error_response, execution_time)
            
            return error_response
        
        finally:
            # Clean up active request
            self.active_requests.pop(request.id, None)
    
    async def _handle_code_generation(self, request: MCPRequest) -> MCPResponse:
        """Handle code generation requests using Gemini"""
        try:
            # Build comprehensive prompt for code generation
            prompt = self._build_code_generation_prompt(request)
            
            # Generate code using Gemini
            response = await self._generate_with_gemini(prompt, request)
            
            # Parse and structure the response
            generated_code = self._extract_code_from_response(response)
            explanation = self._extract_explanation_from_response(response)
            
            # Generate voice output if enabled
            voice_output = None
            if self.config.enable_voice and explanation:
                voice_output = await self._generate_voice_output(explanation)
            
            return MCPResponse(
                request_id=request.id,
                status="success",
                generated_code=generated_code,
                explanation=explanation,
                voice_output=voice_output,
                confidence_score=0.85,  # TODO: Implement confidence calculation
                suggestions=self._generate_suggestions(request, response)
            )
            
        except Exception as e:
            logger.error(f"Code generation failed for request {request.id}: {e}")
            raise
    
    async def _handle_debugging(self, request: MCPRequest) -> MCPResponse:
        """Handle debugging requests"""
        try:
            debug_request = DebuggingRequest(**request.dict())
            
            # Build debugging prompt
            prompt = f"""
            Debug the following code issue:
            
            Error Message: {debug_request.error_message}
            Stack Trace: {debug_request.stack_trace or 'Not provided'}
            Code Snippet:
            ```{request.language or 'text'}
            {debug_request.code_snippet}
            ```
            
            Runtime Environment: {debug_request.runtime_environment}
            
            Please provide:
            1. Root cause analysis
            2. Step-by-step solution
            3. Fixed code
            4. Prevention strategies
            """
            
            response = await self._generate_with_gemini(prompt, request)
            
            return MCPResponse(
                request_id=request.id,
                status="success",
                result={"debug_analysis": response},
                explanation=response,
                suggestions=["Add proper error handling", "Include unit tests", "Use logging"]
            )
            
        except Exception as e:
            logger.error(f"Debugging failed for request {request.id}: {e}")
            raise
    
    async def _handle_architecture_design(self, request: MCPRequest) -> MCPResponse:
        """Handle architecture design requests"""
        try:
            arch_request = ArchitectureRequest(**request.dict())
            
            prompt = f"""
            Design a software architecture for the following requirements:
            
            System Requirements:
            {chr(10).join('- ' + req for req in arch_request.system_requirements)}
            
            Constraints:
            {chr(10).join('- ' + constraint for constraint in arch_request.constraints)}
            
            Preferred Technologies:
            {chr(10).join('- ' + tech for tech in arch_request.preferred_technologies)}
            
            Scale Requirements: {arch_request.scale_requirements}
            
            Please provide:
            1. High-level architecture diagram (text description)
            2. Component breakdown
            3. Technology stack recommendations
            4. Deployment strategy
            5. Scalability considerations
            """
            
            response = await self._generate_with_gemini(prompt, request)
            
            return MCPResponse(
                request_id=request.id,
                status="success",
                result={"architecture_design": response},
                explanation=response,
                suggestions=["Consider microservices", "Plan for monitoring", "Design for failure"]
            )
            
        except Exception as e:
            logger.error(f"Architecture design failed for request {request.id}: {e}")
            raise
    
    async def _handle_voice_command(self, request: MCPRequest) -> MCPResponse:
        """Handle voice command requests"""
        try:
            voice_request = VoiceCommandRequest(**request.dict())
            
            # Decode audio data
            audio_data = base64.b64decode(voice_request.audio_data)
            
            # Process voice input (placeholder - would integrate with speech-to-text)
            transcribed_text = await self._transcribe_audio(audio_data)
            
            # Process the transcribed command
            processed_request = MCPRequest(
                task_type=MCPTaskType.CODE_GENERATION,  # Default fallback
                user_id=request.user_id,
                prompt=transcribed_text,
                context=request.context
            )
            
            # Process as regular request
            result = await self.process_request(processed_request)
            
            # Generate voice response
            voice_output = None
            if result.explanation:
                voice_output = await self._generate_voice_output(result.explanation)
            
            return MCPResponse(
                request_id=request.id,
                status="success",
                result={"transcription": transcribed_text, "response": result.dict()},
                voice_output=voice_output
            )
            
        except Exception as e:
            logger.error(f"Voice command processing failed for request {request.id}: {e}")
            raise
    
    async def _handle_api_integration(self, request: MCPRequest) -> MCPResponse:
        """Handle API integration requests"""
        try:
            prompt = f"""
            Generate API integration code for the following request:
            
            {request.prompt}
            
            Context: {request.context}
            Language: {request.language}
            
            Please provide:
            1. Complete API client code
            2. Error handling
            3. Authentication setup
            4. Usage examples
            5. Test cases
            """
            
            response = await self._generate_with_gemini(prompt, request)
            
            return MCPResponse(
                request_id=request.id,
                status="success",
                generated_code=self._extract_code_from_response(response),
                explanation=response,
                suggestions=["Add rate limiting", "Implement retry logic", "Cache responses"]
            )
            
        except Exception as e:
            logger.error(f"API integration failed for request {request.id}: {e}")
            raise
    
    async def _handle_documentation(self, request: MCPRequest) -> MCPResponse:
        """Handle documentation generation requests"""
        try:
            prompt = f"""
            Generate comprehensive documentation for the following:
            
            {request.prompt}
            
            Context: {request.context}
            Files: {request.files}
            
            Please provide:
            1. README.md content
            2. API documentation
            3. Installation guide
            4. Usage examples
            5. Troubleshooting section
            """
            
            response = await self._generate_with_gemini(prompt, request)
            
            return MCPResponse(
                request_id=request.id,
                status="success",
                result={"documentation": response},
                explanation="Documentation generated successfully",
                suggestions=["Add code examples", "Include diagrams", "Create video tutorials"]
            )
            
        except Exception as e:
            logger.error(f"Documentation generation failed for request {request.id}: {e}")
            raise
    
    async def _handle_testing(self, request: MCPRequest) -> MCPResponse:
        """Handle testing framework requests"""
        try:
            prompt = f"""
            Generate comprehensive test suite for the following:
            
            {request.prompt}
            
            Context: {request.context}
            Language: {request.language}
            
            Please provide:
            1. Unit tests
            2. Integration tests
            3. Test configuration
            4. Mock data/services
            5. CI/CD pipeline setup
            """
            
            response = await self._generate_with_gemini(prompt, request)
            
            return MCPResponse(
                request_id=request.id,
                status="success",
                generated_code=self._extract_code_from_response(response),
                explanation=response,
                suggestions=["Add performance tests", "Include security tests", "Set up test coverage"]
            )
            
        except Exception as e:
            logger.error(f"Testing generation failed for request {request.id}: {e}")
            raise
    
    async def _handle_general_request(self, request: MCPRequest) -> MCPResponse:
        """Handle general AI assistance requests"""
        try:
            response = await self._generate_with_gemini(request.prompt, request)
            
            return MCPResponse(
                request_id=request.id,
                status="success",
                result={"response": response},
                explanation=response
            )
            
        except Exception as e:
            logger.error(f"General request failed for request {request.id}: {e}")
            raise
    
    def _build_code_generation_prompt(self, request: MCPRequest) -> str:
        """Build a comprehensive prompt for code generation"""
        language = request.language.value if request.language else "python"
        context_str = json.dumps(request.context, indent=2) if request.context else "None"
        
        prompt = f"""
        Generate high-quality {language} code for the following request:
        
        Task: {request.prompt}
        
        Context: {context_str}
        
        Requirements:
        - Follow best practices for {language}
        - Include comprehensive error handling
        - Add detailed comments and docstrings
        - Ensure code is production-ready
        - Include type hints where applicable
        - Follow PEP 8 style guide (for Python) or equivalent for other languages
        
        Please provide:
        1. Complete, functional code
        2. Explanation of the approach
        3. Usage examples
        4. Potential improvements or alternatives
        """
        
        return prompt
    
    async def _generate_with_gemini(self, prompt: str, request: MCPRequest) -> str:
        """Generate response using Google Gemini"""
        try:
            # Configure generation parameters
            generation_config = {
                "temperature": self.config.gemini.temperature,
                "top_p": self.config.gemini.top_p,
                "top_k": self.config.gemini.top_k,
                "max_output_tokens": self.config.gemini.max_tokens,
            }
            
            # Generate response
            response = self.gemini_model.generate_content(
                prompt,
                generation_config=generation_config
            )
            
            return response.text
            
        except Exception as e:
            logger.error(f"Gemini generation failed: {e}")
            raise
    
    def _extract_code_from_response(self, response: str) -> Optional[str]:
        """Extract code blocks from AI response"""
        import re
        
        # Look for code blocks marked with triple backticks
        code_pattern = r"```(?:\w+)?\n(.*?)\n```"
        matches = re.findall(code_pattern, response, re.DOTALL)
        
        if matches:
            return matches[0].strip()
        
        return None
    
    def _extract_explanation_from_response(self, response: str) -> str:
        """Extract explanation text from AI response"""
        # Remove code blocks and return the remaining text
        import re
        
        explanation = re.sub(r"```(?:\w+)?\n.*?\n```", "", response, flags=re.DOTALL)
        return explanation.strip()
    
    def _generate_suggestions(self, request: MCPRequest, response: str) -> List[str]:
        """Generate contextual suggestions based on the request and response"""
        suggestions = []
        
        if request.language == ProgrammingLanguage.PYTHON:
            suggestions.extend([
                "Consider adding type hints",
                "Include unit tests",
                "Add logging for debugging"
            ])
        elif request.language == ProgrammingLanguage.JAVASCRIPT:
            suggestions.extend([
                "Use modern ES6+ features",
                "Add JSDoc comments",
                "Consider TypeScript migration"
            ])
        
        # Add task-specific suggestions
        if request.task_type == MCPTaskType.CODE_GENERATION:
            suggestions.append("Review for security vulnerabilities")
        elif request.task_type == MCPTaskType.API_INTEGRATION:
            suggestions.append("Implement rate limiting")
        
        return suggestions
    
    async def _generate_voice_output(self, text: str) -> Optional[str]:
        """Generate voice output using NVIDIA Riva TTS"""
        if not self.riva_client or not self.config.enable_voice:
            return None
        
        try:
            # Prepare TTS request
            tts_request = {
                "text": text,
                "language_code": self.config.riva.language_code,
                "voice_name": self.config.riva.voice_name,
                "sample_rate": self.config.riva.sample_rate,
                "encoding": self.config.riva.audio_encoding
            }
            
            # Send request to Riva TTS service
            response = await self.riva_client.post("/tts/synthesize", json=tts_request)
            
            if response.status_code == 200:
                audio_data = response.content
                # Encode as base64 for transmission
                return base64.b64encode(audio_data).decode('utf-8')
            
        except Exception as e:
            logger.error(f"Voice generation failed: {e}")
        
        return None
    
    async def _transcribe_audio(self, audio_data: bytes) -> str:
        """Transcribe audio to text (placeholder implementation)"""
        # This would integrate with a speech-to-text service
        # For now, return a placeholder
        return "Transcribed audio: [Audio processing not implemented]"
    
    async def _track_analytics(self, request: MCPRequest, response: MCPResponse, 
                             execution_time: float):
        """Track analytics for the processed request"""
        if not self.config.enable_analytics:
            return
        
        analytics = MCPAnalytics(
            user_id=request.user_id,
            project_id=request.project_id,
            task_type=request.task_type,
            language=request.language,
            execution_time=execution_time,
            tokens_used=len(response.result or {}) + len(response.generated_code or ""),
            success=response.status == "success",
            error_type=response.error_message if response.status == "error" else None
        )
        
        self.analytics.append(analytics)
        
        # Log analytics data (could be sent to external analytics service)
        logger.info(f"Analytics tracked for request {request.id}: {analytics.dict()}")
    
    async def get_user_analytics(self, user_id: str, 
                               days: int = 30) -> Dict[str, Any]:
        """Get analytics data for a specific user"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        
        user_analytics = [
            analytics for analytics in self.analytics
            if analytics.user_id == user_id and analytics.timestamp >= cutoff_date
        ]
        
        # Calculate summary statistics
        total_requests = len(user_analytics)
        successful_requests = sum(1 for a in user_analytics if a.success)
        avg_execution_time = sum(a.execution_time for a in user_analytics) / total_requests if total_requests > 0 else 0
        total_tokens = sum(a.tokens_used for a in user_analytics)
        
        # Task type breakdown
        task_counts = {}
        for analytics in user_analytics:
            task_type = analytics.task_type.value
            task_counts[task_type] = task_counts.get(task_type, 0) + 1
        
        return {
            "total_requests": total_requests,
            "successful_requests": successful_requests,
            "success_rate": successful_requests / total_requests if total_requests > 0 else 0,
            "avg_execution_time": avg_execution_time,
            "total_tokens_used": total_tokens,
            "task_type_breakdown": task_counts,
            "period_days": days
        }
