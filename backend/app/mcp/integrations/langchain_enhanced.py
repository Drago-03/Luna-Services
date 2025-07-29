"""
Enhanced LangChain Integration for Universal MCP

This module provides advanced LangChain orchestration for complex AI workflows,
memory management, and chain-of-thought reasoning for development tasks.
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any, Callable, Union
from datetime import datetime, timedelta
import json
import uuid

from langchain.chains import ConversationChain, LLMChain, SequentialChain
from langchain.memory import ConversationBufferWindowMemory, ConversationSummaryMemory
from langchain.prompts import PromptTemplate, ChatPromptTemplate, MessagesPlaceholder
from langchain.schema import BaseMessage, HumanMessage, AIMessage, SystemMessage
from langchain.callbacks.base import BaseCallbackHandler
from langchain.schema.output_parser import OutputParserException
from langchain_core.output_parsers import JsonOutputParser, PydanticOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI

from ..models import (
    MCPRequest, MCPResponse, MCPTaskType, ProgrammingLanguage,
    LangChainConfig, MCPSession
)

logger = logging.getLogger(__name__)

class MCPCallbackHandler(BaseCallbackHandler):
    """Custom callback handler for MCP-specific logging and monitoring"""
    
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.tokens_used = 0
        self.start_time = None
        
    def on_llm_start(self, serialized: Dict[str, Any], prompts: List[str], **kwargs) -> None:
        self.start_time = datetime.utcnow()
        logger.info(f"LangChain LLM started for session {self.session_id}")
        
    def on_llm_end(self, response: Any, **kwargs) -> None:
        if self.start_time:
            duration = (datetime.utcnow() - self.start_time).total_seconds()
            logger.info(f"LangChain LLM completed in {duration:.2f}s for session {self.session_id}")
            
    def on_llm_error(self, error: Union[Exception, KeyboardInterrupt], **kwargs) -> None:
        logger.error(f"LangChain LLM error in session {self.session_id}: {error}")

class EnhancedLangChainService:
    """
    Advanced LangChain service for orchestrating complex AI development workflows
    """
    
    def __init__(self, config: LangChainConfig, gemini_api_key: str):
        """Initialize the enhanced LangChain service"""
        self.config = config
        self.gemini_api_key = gemini_api_key
        self.chains: Dict[str, Any] = {}
        self.sessions: Dict[str, MCPSession] = {}
        
        # Initialize the LLM
        self._initialize_llm()
        
        # Initialize specialized chains
        self._initialize_chains()
        
    def _initialize_llm(self):
        """Initialize the Google Gemini LLM for LangChain"""
        try:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                google_api_key=self.gemini_api_key,
                temperature=0.7,
                max_tokens=8192,
            )
            logger.info("LangChain Gemini LLM initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize LangChain LLM: {e}")
            raise
    
    def _initialize_chains(self):
        """Initialize specialized chains for different development tasks"""
        
        # Code Analysis Chain
        self.chains["code_analysis"] = self._create_code_analysis_chain()
        
        # Architecture Planning Chain
        self.chains["architecture_planning"] = self._create_architecture_planning_chain()
        
        # Debugging Chain
        self.chains["debugging"] = self._create_debugging_chain()
        
        # Code Review Chain
        self.chains["code_review"] = self._create_code_review_chain()
        
        # Documentation Chain
        self.chains["documentation"] = self._create_documentation_chain()
        
        # Testing Strategy Chain
        self.chains["testing_strategy"] = self._create_testing_strategy_chain()
        
        logger.info("Specialized LangChain chains initialized")
    
    def _create_code_analysis_chain(self) -> SequentialChain:
        """Create a chain for comprehensive code analysis"""
        
        # Step 1: Code Understanding
        understanding_prompt = PromptTemplate(
            input_variables=["code", "language"],
            template="""
            Analyze the following {language} code and provide a comprehensive understanding:
            
            Code:
            {code}
            
            Please provide:
            1. High-level purpose and functionality
            2. Key components and their roles
            3. Data flow and logic flow
            4. Dependencies and external interfaces
            5. Potential complexity areas
            
            Analysis:
            """
        )
        
        understanding_chain = LLMChain(
            llm=self.llm,
            prompt=understanding_prompt,
            output_key="understanding"
        )
        
        # Step 2: Quality Assessment
        quality_prompt = PromptTemplate(
            input_variables=["code", "understanding"],
            template="""
            Based on the code understanding: {understanding}
            
            Assess the code quality across these dimensions:
            
            Code:
            {code}
            
            Quality Assessment:
            1. Code structure and organization (1-10)
            2. Readability and maintainability (1-10)
            3. Performance considerations (1-10)
            4. Security implications (1-10)
            5. Best practices adherence (1-10)
            6. Error handling robustness (1-10)
            
            Provide specific examples and recommendations for each dimension.
            
            Assessment:
            """
        )
        
        quality_chain = LLMChain(
            llm=self.llm,
            prompt=quality_prompt,
            output_key="quality_assessment"
        )
        
        # Step 3: Improvement Recommendations
        improvement_prompt = PromptTemplate(
            input_variables=["understanding", "quality_assessment"],
            template="""
            Based on the code understanding and quality assessment:
            
            Understanding: {understanding}
            Quality Assessment: {quality_assessment}
            
            Provide specific, actionable improvement recommendations:
            
            1. Immediate fixes (critical issues)
            2. Short-term improvements (performance, readability)
            3. Long-term enhancements (architecture, scalability)
            4. Best practices to implement
            5. Testing strategies
            
            For each recommendation, provide:
            - Priority level (High/Medium/Low)
            - Implementation effort (Small/Medium/Large)
            - Expected impact
            - Code examples when applicable
            
            Recommendations:
            """
        )
        
        improvement_chain = LLMChain(
            llm=self.llm,
            prompt=improvement_prompt,
            output_key="improvements"
        )
        
        return SequentialChain(
            chains=[understanding_chain, quality_chain, improvement_chain],
            input_variables=["code", "language"],
            output_variables=["understanding", "quality_assessment", "improvements"]
        )
    
    def _create_architecture_planning_chain(self) -> SequentialChain:
        """Create a chain for system architecture planning"""
        
        # Step 1: Requirements Analysis
        requirements_prompt = PromptTemplate(
            input_variables=["project_description", "constraints"],
            template="""
            Analyze the project requirements and constraints:
            
            Project Description: {project_description}
            Constraints: {constraints}
            
            Please provide:
            1. Functional requirements breakdown
            2. Non-functional requirements (performance, scalability, security)
            3. Technical constraints analysis
            4. Stakeholder considerations
            5. Success criteria definition
            
            Requirements Analysis:
            """
        )
        
        requirements_chain = LLMChain(
            llm=self.llm,
            prompt=requirements_prompt,
            output_key="requirements"
        )
        
        # Step 2: Architecture Design
        architecture_prompt = PromptTemplate(
            input_variables=["requirements"],
            template="""
            Based on the requirements analysis: {requirements}
            
            Design a comprehensive system architecture:
            
            1. High-level architecture overview
            2. Component breakdown and responsibilities
            3. Data flow and communication patterns
            4. Technology stack recommendations
            5. Scalability strategy
            6. Security architecture
            7. Deployment considerations
            
            Architecture Design:
            """
        )
        
        architecture_chain = LLMChain(
            llm=self.llm,
            prompt=architecture_prompt,
            output_key="architecture"
        )
        
        # Step 3: Implementation Plan
        implementation_prompt = PromptTemplate(
            input_variables=["requirements", "architecture"],
            template="""
            Based on requirements and architecture:
            
            Requirements: {requirements}
            Architecture: {architecture}
            
            Create a detailed implementation plan:
            
            1. Development phases and milestones
            2. Component implementation order
            3. Technology setup and configuration
            4. Team structure and skill requirements
            5. Risk assessment and mitigation
            6. Testing strategy
            7. Deployment and monitoring plan
            
            Implementation Plan:
            """
        )
        
        implementation_chain = LLMChain(
            llm=self.llm,
            prompt=implementation_prompt,
            output_key="implementation_plan"
        )
        
        return SequentialChain(
            chains=[requirements_chain, architecture_chain, implementation_chain],
            input_variables=["project_description", "constraints"],
            output_variables=["requirements", "architecture", "implementation_plan"]
        )
    
    def _create_debugging_chain(self) -> SequentialChain:
        """Create a chain for systematic debugging"""
        
        # Step 1: Problem Analysis
        problem_prompt = PromptTemplate(
            input_variables=["error_message", "code", "context"],
            template="""
            Analyze the debugging problem:
            
            Error Message: {error_message}
            Code: {code}
            Context: {context}
            
            Provide:
            1. Error categorization (syntax, runtime, logic, etc.)
            2. Probable root cause analysis
            3. Error propagation path
            4. Related code areas to investigate
            5. Data state analysis
            
            Problem Analysis:
            """
        )
        
        problem_chain = LLMChain(
            llm=self.llm,
            prompt=problem_prompt,
            output_key="problem_analysis"
        )
        
        # Step 2: Solution Strategy
        solution_prompt = PromptTemplate(
            input_variables=["problem_analysis", "code"],
            template="""
            Based on problem analysis: {problem_analysis}
            
            Original Code: {code}
            
            Develop a debugging solution strategy:
            
            1. Step-by-step debugging approach
            2. Tools and techniques to use
            3. Key variables and states to monitor
            4. Test cases to validate the fix
            5. Alternative solutions to consider
            
            Solution Strategy:
            """
        )
        
        solution_chain = LLMChain(
            llm=self.llm,
            prompt=solution_prompt,
            output_key="solution_strategy"
        )
        
        # Step 3: Fixed Code
        fix_prompt = PromptTemplate(
            input_variables=["problem_analysis", "solution_strategy", "code"],
            template="""
            Apply the debugging solution:
            
            Problem Analysis: {problem_analysis}
            Solution Strategy: {solution_strategy}
            Original Code: {code}
            
            Provide:
            1. Corrected code with clear annotations
            2. Explanation of changes made
            3. Prevention strategies for similar issues
            4. Testing recommendations
            5. Monitoring suggestions
            
            Fixed Code and Explanation:
            """
        )
        
        fix_chain = LLMChain(
            llm=self.llm,
            prompt=fix_prompt,
            output_key="fixed_code"
        )
        
        return SequentialChain(
            chains=[problem_chain, solution_chain, fix_chain],
            input_variables=["error_message", "code", "context"],
            output_variables=["problem_analysis", "solution_strategy", "fixed_code"]
        )
    
    def _create_code_review_chain(self) -> LLMChain:
        """Create a chain for comprehensive code review"""
        
        review_prompt = PromptTemplate(
            input_variables=["code", "language", "review_criteria"],
            template="""
            Conduct a comprehensive code review for the following {language} code:
            
            Code:
            {code}
            
            Review Criteria: {review_criteria}
            
            Please provide a detailed review covering:
            
            1. **Code Quality Assessment**
               - Readability and maintainability
               - Adherence to coding standards
               - Code organization and structure
            
            2. **Functionality Review**
               - Logic correctness
               - Edge case handling
               - Input validation
            
            3. **Performance Analysis**
               - Algorithm efficiency
               - Resource usage
               - Scalability considerations
            
            4. **Security Review**
               - Vulnerability assessment
               - Input sanitization
               - Authentication/authorization
            
            5. **Testing Considerations**
               - Testability
               - Test coverage suggestions
               - Mock/stub requirements
            
            6. **Specific Recommendations**
               - Immediate fixes required
               - Suggested improvements
               - Best practices to implement
            
            Code Review:
            """
        )
        
        return LLMChain(
            llm=self.llm,
            prompt=review_prompt
        )
    
    def _create_documentation_chain(self) -> LLMChain:
        """Create a chain for generating comprehensive documentation"""
        
        doc_prompt = PromptTemplate(
            input_variables=["code", "doc_type", "audience"],
            template="""
            Generate {doc_type} documentation for the following code, targeting {audience}:
            
            Code:
            {code}
            
            Please create comprehensive documentation including:
            
            1. **Overview and Purpose**
               - What the code does
               - Why it exists
               - Key benefits and features
            
            2. **API Documentation** (if applicable)
               - Function/method signatures
               - Parameter descriptions
               - Return value specifications
               - Usage examples
            
            3. **Architecture Documentation**
               - Component relationships
               - Data flow diagrams (described)
               - Design patterns used
            
            4. **Usage Guide**
               - Setup and installation
               - Basic usage examples
               - Advanced configuration
            
            5. **Troubleshooting**
               - Common issues
               - Error messages and solutions
               - Performance considerations
            
            6. **Contributing Guidelines** (if applicable)
               - Development setup
               - Coding standards
               - Testing requirements
            
            Documentation:
            """
        )
        
        return LLMChain(
            llm=self.llm,
            prompt=doc_prompt
        )
    
    def _create_testing_strategy_chain(self) -> SequentialChain:
        """Create a chain for comprehensive testing strategy"""
        
        # Step 1: Test Analysis
        analysis_prompt = PromptTemplate(
            input_variables=["code", "requirements"],
            template="""
            Analyze testing requirements for the code:
            
            Code: {code}
            Requirements: {requirements}
            
            Provide:
            1. Critical functionality to test
            2. Edge cases and boundary conditions
            3. Error scenarios to validate
            4. Integration points to test
            5. Performance testing considerations
            
            Test Analysis:
            """
        )
        
        analysis_chain = LLMChain(
            llm=self.llm,
            prompt=analysis_prompt,
            output_key="test_analysis"
        )
        
        # Step 2: Test Strategy
        strategy_prompt = PromptTemplate(
            input_variables=["test_analysis"],
            template="""
            Based on test analysis: {test_analysis}
            
            Develop a comprehensive testing strategy:
            
            1. Testing pyramid structure (unit, integration, e2e)
            2. Test framework recommendations
            3. Mock and stub strategies
            4. Test data management
            5. Continuous testing approach
            6. Performance testing plan
            7. Security testing considerations
            
            Testing Strategy:
            """
        )
        
        strategy_chain = LLMChain(
            llm=self.llm,
            prompt=strategy_prompt,
            output_key="test_strategy"
        )
        
        return SequentialChain(
            chains=[analysis_chain, strategy_chain],
            input_variables=["code", "requirements"],
            output_variables=["test_analysis", "test_strategy"]
        )
    
    async def process_workflow(self, request: MCPRequest, workflow_type: str) -> Dict[str, Any]:
        """Process a request using the appropriate LangChain workflow"""
        try:
            session_id = request.user_id
            callback_handler = MCPCallbackHandler(session_id)
            
            # Select the appropriate chain
            if workflow_type not in self.chains:
                raise ValueError(f"Unknown workflow type: {workflow_type}")
            
            chain = self.chains[workflow_type]
            
            # Prepare inputs based on workflow type
            inputs = self._prepare_workflow_inputs(request, workflow_type)
            
            # Execute the chain
            result = await asyncio.to_thread(
                chain.run,
                callbacks=[callback_handler],
                **inputs
            )
            
            return {
                "workflow_type": workflow_type,
                "result": result,
                "session_id": session_id,
                "execution_time": callback_handler.start_time
            }
            
        except Exception as e:
            logger.error(f"Error processing LangChain workflow {workflow_type}: {e}")
            raise
    
    def _prepare_workflow_inputs(self, request: MCPRequest, workflow_type: str) -> Dict[str, Any]:
        """Prepare inputs for different workflow types"""
        
        if workflow_type == "code_analysis":
            return {
                "code": request.context.get("code", request.prompt),
                "language": request.language.value if request.language else "unknown"
            }
        
        elif workflow_type == "architecture_planning":
            return {
                "project_description": request.prompt,
                "constraints": json.dumps(request.context.get("constraints", {}))
            }
        
        elif workflow_type == "debugging":
            return {
                "error_message": request.context.get("error_message", ""),
                "code": request.context.get("code", ""),
                "context": json.dumps(request.context)
            }
        
        elif workflow_type == "code_review":
            return {
                "code": request.context.get("code", request.prompt),
                "language": request.language.value if request.language else "unknown",
                "review_criteria": request.context.get("review_criteria", "standard")
            }
        
        elif workflow_type == "documentation":
            return {
                "code": request.context.get("code", request.prompt),
                "doc_type": request.context.get("doc_type", "API"),
                "audience": request.context.get("audience", "developers")
            }
        
        elif workflow_type == "testing_strategy":
            return {
                "code": request.context.get("code", ""),
                "requirements": request.prompt
            }
        
        else:
            return {"input": request.prompt}
    
    async def create_conversation_session(self, user_id: str, project_id: Optional[str] = None) -> str:
        """Create a new conversation session with memory"""
        
        session_id = str(uuid.uuid4())
        
        # Initialize conversation memory
        memory = ConversationBufferWindowMemory(
            k=self.config.max_memory_length,
            return_messages=True,
            memory_key="chat_history"
        )
        
        # Create conversation chain
        conversation_chain = ConversationChain(
            llm=self.llm,
            memory=memory,
            verbose=True
        )
        
        # Store session
        session = MCPSession(
            id=session_id,
            user_id=user_id,
            project_id=project_id,
            conversation_chain=conversation_chain,
            memory=memory
        )
        
        self.sessions[session_id] = session
        
        logger.info(f"Created conversation session {session_id} for user {user_id}")
        return session_id
    
    async def continue_conversation(self, session_id: str, message: str) -> str:
        """Continue a conversation in an existing session"""
        
        if session_id not in self.sessions:
            raise ValueError(f"Session {session_id} not found")
        
        session = self.sessions[session_id]
        
        try:
            response = await asyncio.to_thread(
                session.conversation_chain.predict,
                input=message
            )
            
            return response
            
        except Exception as e:
            logger.error(f"Error in conversation session {session_id}: {e}")
            raise
    
    def get_session_history(self, session_id: str) -> List[Dict[str, str]]:
        """Get conversation history for a session"""
        
        if session_id not in self.sessions:
            return []
        
        session = self.sessions[session_id]
        messages = session.memory.chat_memory.messages
        
        history = []
        for message in messages:
            if isinstance(message, HumanMessage):
                history.append({"role": "human", "content": message.content})
            elif isinstance(message, AIMessage):
                history.append({"role": "ai", "content": message.content})
        
        return history
    
    def clear_session(self, session_id: str):
        """Clear a conversation session"""
        if session_id in self.sessions:
            del self.sessions[session_id]
            logger.info(f"Cleared session {session_id}")
