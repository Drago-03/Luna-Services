"""
Enhanced Google Gemini 2.5 Flash Integration for Universal MCP

This module provides advanced Gemini integration with multi-modal capabilities,
code generation optimization, and real-time streaming responses.
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any, AsyncGenerator, Union
from datetime import datetime
import json
import base64
import io
from pathlib import Path

import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
from PIL import Image
import aiofiles

from ..models import (
    MCPRequest, MCPResponse, MCPTaskType, ProgrammingLanguage,
    CodeGenerationRequest, DebuggingRequest, ArchitectureRequest,
    GeminiConfig
)

logger = logging.getLogger(__name__)

class EnhancedGeminiService:
    """
    Advanced Gemini 2.5 Flash service with specialized prompts for development tasks
    """
    
    def __init__(self, config: GeminiConfig):
        """Initialize the enhanced Gemini service"""
        self.config = config
        self.model = None
        
        # Safety settings for development context
        self.safety_settings = {
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        }
        
        self._initialize_model()
        
        # Specialized prompts for different development tasks
        self.system_prompts = {
            MCPTaskType.CODE_GENERATION: self._get_code_generation_prompt(),
            MCPTaskType.CODE_OPTIMIZATION: self._get_code_optimization_prompt(),
            MCPTaskType.DEBUGGING: self._get_debugging_prompt(),
            MCPTaskType.ARCHITECTURE_DESIGN: self._get_architecture_prompt(),
            MCPTaskType.API_INTEGRATION: self._get_api_integration_prompt(),
            MCPTaskType.DOCUMENTATION: self._get_documentation_prompt(),
            MCPTaskType.TESTING: self._get_testing_prompt(),
        }
    
    def _initialize_model(self):
        """Initialize the Gemini model with enhanced configuration"""
        try:
            genai.configure(api_key=self.config.api_key)
            
            generation_config = genai.types.GenerationConfig(
                temperature=self.config.temperature,
                max_output_tokens=self.config.max_tokens,
                top_p=0.95,
                top_k=64,
            )
            
            self.model = genai.GenerativeModel(
                model_name=self.config.model_name,
                generation_config=generation_config,
                safety_settings=self.safety_settings
            )
            
            logger.info(f"Enhanced Gemini model {self.config.model_name} initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Gemini model: {e}")
            raise
    
    def _get_code_generation_prompt(self) -> str:
        """Get specialized prompt for code generation tasks"""
        return """
You are an expert software developer assistant powered by Google Gemini 2.5 Flash.
Your role is to generate high-quality, production-ready code based on user requirements.

Core Principles:
1. Write clean, maintainable, and well-documented code
2. Follow language-specific best practices and conventions
3. Include comprehensive error handling
4. Add appropriate type hints and comments
5. Consider performance and security implications
6. Generate accompanying unit tests when requested

Response Format:
- Provide complete, runnable code
- Include clear explanations of design decisions
- Suggest improvements or alternative approaches
- Mention any dependencies or setup requirements

Always ask clarifying questions if requirements are ambiguous.
"""
    
    def _get_code_optimization_prompt(self) -> str:
        """Get specialized prompt for code optimization tasks"""
        return """
You are a code optimization specialist powered by Google Gemini 2.5 Flash.
Your expertise includes performance optimization, memory management, and architectural improvements.

Analysis Areas:
1. Time and space complexity analysis
2. Algorithm efficiency improvements
3. Memory usage optimization
4. Database query optimization
5. Code structure and readability
6. Security vulnerability assessment

Response Format:
- Identify specific optimization opportunities
- Provide before/after code comparisons
- Explain performance impact quantitatively when possible
- Suggest profiling strategies
- Recommend monitoring approaches
"""
    
    def _get_debugging_prompt(self) -> str:
        """Get specialized prompt for debugging tasks"""
        return """
You are a debugging expert powered by Google Gemini 2.5 Flash.
Your role is to identify, analyze, and resolve software issues efficiently.

Debugging Process:
1. Analyze error messages and stack traces
2. Identify root causes and contributing factors
3. Provide step-by-step debugging strategies
4. Suggest preventive measures
5. Recommend testing approaches

Response Format:
- Clear problem identification
- Root cause analysis
- Detailed solution steps
- Prevention strategies
- Testing recommendations
"""
    
    def _get_architecture_prompt(self) -> str:
        """Get specialized prompt for architecture design tasks"""
        return """
You are a software architecture expert powered by Google Gemini 2.5 Flash.
Your expertise spans system design, scalability, and architectural patterns.

Design Considerations:
1. Scalability and performance requirements
2. Security and compliance needs
3. Maintainability and extensibility
4. Technology stack recommendations
5. Design patterns and architectural styles
6. Integration strategies

Response Format:
- High-level architectural overview
- Detailed component design
- Technology recommendations
- Scalability considerations
- Security implications
- Implementation roadmap
"""
    
    def _get_api_integration_prompt(self) -> str:
        """Get specialized prompt for API integration tasks"""
        return """
You are an API integration specialist powered by Google Gemini 2.5 Flash.
Your expertise includes REST APIs, GraphQL, microservices, and third-party integrations.

Integration Areas:
1. API design and documentation
2. Authentication and authorization
3. Rate limiting and error handling
4. Data transformation and validation
5. Testing and monitoring
6. Version management

Response Format:
- Complete integration code
- Error handling strategies
- Testing approaches
- Documentation examples
- Security considerations
"""
    
    def _get_documentation_prompt(self) -> str:
        """Get specialized prompt for documentation tasks"""
        return """
You are a technical documentation expert powered by Google Gemini 2.5 Flash.
Your role is to create clear, comprehensive, and user-friendly documentation.

Documentation Types:
1. API documentation with examples
2. Code comments and docstrings
3. Architecture documentation
4. User guides and tutorials
5. Troubleshooting guides
6. Contributing guidelines

Response Format:
- Well-structured markdown documentation
- Code examples with explanations
- Visual diagrams when helpful
- Step-by-step instructions
- Best practices and tips
"""
    
    def _get_testing_prompt(self) -> str:
        """Get specialized prompt for testing tasks"""
        return """
You are a software testing expert powered by Google Gemini 2.5 Flash.
Your expertise includes unit testing, integration testing, and test automation.

Testing Areas:
1. Unit test generation
2. Integration test strategies
3. Test data management
4. Performance testing
5. Security testing
6. Test automation frameworks

Response Format:
- Complete test code with assertions
- Test case descriptions
- Mock and fixture strategies
- Coverage recommendations
- CI/CD integration approaches
"""
    
    async def process_request(self, request: MCPRequest) -> MCPResponse:
        """Process an MCP request using Gemini 2.5 Flash"""
        try:
            start_time = datetime.utcnow()
            
            # Build the prompt with context
            prompt = self._build_prompt(request)
            
            # Handle multi-modal inputs
            inputs = [prompt]
            if request.image_input:
                image = self._decode_image(request.image_input)
                inputs.append(image)
            
            # Generate response
            response = await self._generate_response(inputs, request)
            
            # Calculate execution time
            execution_time = (datetime.utcnow() - start_time).total_seconds()
            
            return MCPResponse(
                request_id=request.id,
                status="success",
                result=response,
                generated_code=response.get("code"),
                explanation=response.get("explanation"),
                suggestions=response.get("suggestions", []),
                confidence_score=response.get("confidence"),
                execution_time=execution_time,
                tokens_used=response.get("tokens_used"),
                completed_at=datetime.utcnow()
            )
            
        except Exception as e:
            logger.error(f"Error processing Gemini request {request.id}: {e}")
            return MCPResponse(
                request_id=request.id,
                status="error",
                error_message=str(e),
                completed_at=datetime.utcnow()
            )
    
    def _build_prompt(self, request: MCPRequest) -> str:
        """Build a comprehensive prompt for the request"""
        system_prompt = self.system_prompts.get(request.task_type, "")
        
        prompt_parts = [system_prompt]
        
        # Add task-specific context
        if request.language:
            prompt_parts.append(f"Programming Language: {request.language.value}")
        
        if request.context:
            prompt_parts.append(f"Context: {json.dumps(request.context, indent=2)}")
        
        if request.files:
            prompt_parts.append("Related Files:")
            for file_info in request.files:
                prompt_parts.append(f"File: {file_info.get('name', 'Unknown')}")
                prompt_parts.append(f"Content: {file_info.get('content', '')}")
        
        # Add the main prompt
        prompt_parts.append(f"Task: {request.prompt}")
        
        # Add metadata if available
        if request.metadata:
            prompt_parts.append(f"Additional Information: {json.dumps(request.metadata, indent=2)}")
        
        return "\n\n".join(prompt_parts)
    
    async def _generate_response(self, inputs: List[Any], request: MCPRequest) -> Dict[str, Any]:
        """Generate response using Gemini model"""
        try:
            # Generate content
            response = await asyncio.to_thread(
                self.model.generate_content,
                inputs,
                stream=False
            )
            
            # Parse the response
            content = response.text
            
            # Extract structured information
            result = {
                "content": content,
                "tokens_used": response.usage_metadata.total_token_count if hasattr(response, 'usage_metadata') else None,
                "confidence": self._calculate_confidence(response)
            }
            
            # Task-specific parsing
            if request.task_type == MCPTaskType.CODE_GENERATION:
                result.update(self._parse_code_response(content))
            elif request.task_type == MCPTaskType.DEBUGGING:
                result.update(self._parse_debug_response(content))
            elif request.task_type == MCPTaskType.ARCHITECTURE_DESIGN:
                result.update(self._parse_architecture_response(content))
            
            return result
            
        except Exception as e:
            logger.error(f"Error generating Gemini response: {e}")
            raise
    
    def _decode_image(self, base64_image: str) -> Image.Image:
        """Decode base64 image for multi-modal processing"""
        try:
            image_data = base64.b64decode(base64_image)
            image = Image.open(io.BytesIO(image_data))
            return image
        except Exception as e:
            logger.error(f"Error decoding image: {e}")
            raise
    
    def _calculate_confidence(self, response) -> float:
        """Calculate confidence score based on response characteristics"""
        # Simple confidence calculation - can be enhanced with more sophisticated metrics
        try:
            content_length = len(response.text)
            if content_length > 500:
                return 0.9
            elif content_length > 200:
                return 0.7
            else:
                return 0.5
        except:
            return 0.5
    
    def _parse_code_response(self, content: str) -> Dict[str, Any]:
        """Parse code generation response"""
        # Extract code blocks
        import re
        code_blocks = re.findall(r'```[\w]*\n(.*?)\n```', content, re.DOTALL)
        
        return {
            "code": code_blocks[0] if code_blocks else "",
            "explanation": content,
            "suggestions": self._extract_suggestions(content)
        }
    
    def _parse_debug_response(self, content: str) -> Dict[str, Any]:
        """Parse debugging response"""
        return {
            "explanation": content,
            "suggestions": self._extract_suggestions(content),
            "debug_steps": self._extract_debug_steps(content)
        }
    
    def _parse_architecture_response(self, content: str) -> Dict[str, Any]:
        """Parse architecture design response"""
        return {
            "explanation": content,
            "suggestions": self._extract_suggestions(content),
            "components": self._extract_components(content)
        }
    
    def _extract_suggestions(self, content: str) -> List[str]:
        """Extract suggestions from response content"""
        # Simple suggestion extraction - can be enhanced
        suggestions = []
        lines = content.split('\n')
        for line in lines:
            if any(keyword in line.lower() for keyword in ['suggest', 'recommend', 'consider', 'tip']):
                suggestions.append(line.strip())
        return suggestions[:5]  # Limit to 5 suggestions
    
    def _extract_debug_steps(self, content: str) -> List[str]:
        """Extract debugging steps from content"""
        steps = []
        lines = content.split('\n')
        for line in lines:
            if any(keyword in line.lower() for keyword in ['step', 'first', 'next', 'then', 'finally']):
                steps.append(line.strip())
        return steps
    
    def _extract_components(self, content: str) -> List[Dict[str, str]]:
        """Extract architectural components from content"""
        components = []
        # This would be enhanced with more sophisticated parsing
        return components
    
    async def stream_response(self, request: MCPRequest) -> AsyncGenerator[str, None]:
        """Stream response for real-time interaction"""
        try:
            prompt = self._build_prompt(request)
            
            response = self.model.generate_content(
                prompt,
                stream=True
            )
            
            for chunk in response:
                if chunk.text:
                    yield chunk.text
                    
        except Exception as e:
            logger.error(f"Error streaming Gemini response: {e}")
            yield f"Error: {str(e)}"
