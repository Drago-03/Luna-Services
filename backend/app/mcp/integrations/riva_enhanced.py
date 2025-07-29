"""
NVIDIA Riva TTS Integration for Universal MCP

This module provides advanced voice synthesis capabilities using NVIDIA Riva,
enabling voice-enabled development assistance and audio response generation.
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any, Union
from datetime import datetime
import base64
import io
import json
import wave
import tempfile
import os

import grpc
import httpx
import librosa
import soundfile as sf
import numpy as np

# Riva imports (would be added when Riva is properly set up)
try:
    import riva.client as riva_client
    import riva.client.proto.riva_tts_pb2 as rtts
    import riva.client.proto.riva_asr_pb2 as rasr
    RIVA_AVAILABLE = True
except ImportError:
    RIVA_AVAILABLE = False
    logger = logging.getLogger(__name__)
    logger.warning("NVIDIA Riva client not available. Voice features will be limited.")

from ..models import (
    MCPRequest, MCPResponse, VoiceCommandRequest,
    RivaConfig
)

logger = logging.getLogger(__name__)

class EnhancedRivaService:
    """
    Advanced NVIDIA Riva service for voice synthesis and recognition
    """
    
    def __init__(self, config: RivaConfig):
        """Initialize the enhanced Riva service"""
        self.config = config
        self.tts_client = None
        self.asr_client = None
        self.is_available = RIVA_AVAILABLE
        
        if self.is_available:
            self._initialize_riva_clients()
        else:
            self._initialize_fallback_tts()
        
        # Voice synthesis settings
        self.voice_settings = {
            "default": {
                "voice": "English-US.Female-1",
                "language_code": "en-US",
                "sample_rate": 22050,
                "quality": "high"
            },
            "code_narration": {
                "voice": "English-US.Male-1", 
                "language_code": "en-US",
                "sample_rate": 22050,
                "quality": "high",
                "speaking_rate": 0.9  # Slightly slower for code
            },
            "explanation": {
                "voice": "English-US.Female-1",
                "language_code": "en-US", 
                "sample_rate": 22050,
                "quality": "high",
                "speaking_rate": 1.0
            }
        }
        
    def _initialize_riva_clients(self):
        """Initialize NVIDIA Riva TTS and ASR clients"""
        try:
            # Create authentication credentials
            auth = riva_client.Auth(uri=self.config.server_url)
            
            # Initialize TTS client
            self.tts_client = riva_client.SpeechSynthesisService(auth)
            
            # Initialize ASR client
            self.asr_client = riva_client.ASRService(auth)
            
            logger.info("NVIDIA Riva clients initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Riva clients: {e}")
            self.is_available = False
            self._initialize_fallback_tts()
    
    def _initialize_fallback_tts(self):
        """Initialize fallback TTS using web services"""
        self.fallback_client = httpx.AsyncClient(timeout=30.0)
        logger.info("Fallback TTS service initialized")
    
    async def synthesize_speech(self, text: str, voice_type: str = "default", 
                              language: str = "en-US") -> str:
        """
        Synthesize speech from text using NVIDIA Riva TTS
        
        Args:
            text: Text to synthesize
            voice_type: Type of voice (default, code_narration, explanation)
            language: Language code
            
        Returns:
            Base64 encoded audio data
        """
        try:
            if self.is_available and self.tts_client:
                return await self._riva_synthesize_speech(text, voice_type, language)
            else:
                return await self._fallback_synthesize_speech(text, voice_type, language)
                
        except Exception as e:
            logger.error(f"Error synthesizing speech: {e}")
            return ""
    
    async def _riva_synthesize_speech(self, text: str, voice_type: str, 
                                    language: str) -> str:
        """Synthesize speech using NVIDIA Riva"""
        try:
            # Get voice settings
            settings = self.voice_settings.get(voice_type, self.voice_settings["default"])
            
            # Prepare synthesis request
            req = rtts.SynthesizeSpeechRequest()
            req.text = text
            req.language_code = settings["language_code"]
            req.voice_name = settings["voice"]
            req.audio_config.audio_encoding = rtts.AudioEncoding.LINEAR_PCM
            req.audio_config.sample_rate_hertz = settings["sample_rate"]
            
            # Add speaking rate if specified
            if "speaking_rate" in settings:
                req.audio_config.speaking_rate = settings["speaking_rate"]
            
            # Synthesize speech
            response = await asyncio.to_thread(
                self.tts_client.synthesize,
                req
            )
            
            # Convert audio to base64
            audio_base64 = base64.b64encode(response.audio).decode('utf-8')
            
            logger.info(f"Successfully synthesized speech for text: {text[:50]}...")
            return audio_base64
            
        except Exception as e:
            logger.error(f"Riva TTS synthesis error: {e}")
            # Fallback to alternative TTS
            return await self._fallback_synthesize_speech(text, voice_type, language)
    
    async def _fallback_synthesize_speech(self, text: str, voice_type: str, 
                                        language: str) -> str:
        """Fallback TTS using web services or local synthesis"""
        try:
            # For demo purposes, return empty audio
            # In production, this would integrate with services like:
            # - Google Cloud Text-to-Speech
            # - Amazon Polly
            # - Azure Cognitive Services Speech
            # - Local TTS engines like espeak, festival, etc.
            
            logger.info(f"Using fallback TTS for: {text[:50]}...")
            
            # Generate silent audio as placeholder
            duration = len(text) * 0.1  # Approximate duration
            sample_rate = 22050
            samples = int(duration * sample_rate)
            audio_data = np.zeros(samples, dtype=np.float32)
            
            # Convert to bytes
            audio_bytes = (audio_data * 32767).astype(np.int16).tobytes()
            
            # Encode as base64
            audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
            
            return audio_base64
            
        except Exception as e:
            logger.error(f"Fallback TTS error: {e}")
            return ""
    
    async def recognize_speech(self, audio_data: str, language: str = "en-US") -> str:
        """
        Recognize speech from audio data using NVIDIA Riva ASR
        
        Args:
            audio_data: Base64 encoded audio data
            language: Language code for recognition
            
        Returns:
            Recognized text
        """
        try:
            if self.is_available and self.asr_client:
                return await self._riva_recognize_speech(audio_data, language)
            else:
                return await self._fallback_recognize_speech(audio_data, language)
                
        except Exception as e:
            logger.error(f"Error recognizing speech: {e}")
            return ""
    
    async def _riva_recognize_speech(self, audio_data: str, language: str) -> str:
        """Recognize speech using NVIDIA Riva ASR"""
        try:
            # Decode audio data
            audio_bytes = base64.b64decode(audio_data)
            
            # Prepare recognition request
            req = rasr.RecognizeRequest()
            req.audio = audio_bytes
            req.config.language_code = language
            req.config.max_alternatives = 1
            req.config.profanity_filter = False
            req.config.enable_automatic_punctuation = True
            req.config.enable_word_time_offsets = True
            
            # Perform recognition
            response = await asyncio.to_thread(
                self.asr_client.recognize,
                req
            )
            
            if response.results:
                text = response.results[0].alternatives[0].transcript
                logger.info(f"Successfully recognized speech: {text}")
                return text
            else:
                return ""
                
        except Exception as e:
            logger.error(f"Riva ASR recognition error: {e}")
            return await self._fallback_recognize_speech(audio_data, language)
    
    async def _fallback_recognize_speech(self, audio_data: str, language: str) -> str:
        """Fallback speech recognition using web services"""
        try:
            # For demo purposes, return placeholder text
            # In production, this would integrate with services like:
            # - Google Cloud Speech-to-Text
            # - Amazon Transcribe
            # - Azure Speech Services
            # - Local ASR engines
            
            logger.info("Using fallback ASR")
            return "Voice command received (fallback recognition)"
            
        except Exception as e:
            logger.error(f"Fallback ASR error: {e}")
            return ""
    
    async def process_voice_command(self, request: VoiceCommandRequest) -> MCPResponse:
        """Process a voice command request"""
        try:
            start_time = datetime.utcnow()
            
            # Step 1: Recognize speech if audio input provided
            recognized_text = ""
            if request.voice_input:
                recognized_text = await self.recognize_speech(
                    request.voice_input, 
                    request.language or "en-US"
                )
            
            # Step 2: Use recognized text or provided prompt
            command_text = recognized_text or request.prompt
            
            if not command_text:
                return MCPResponse(
                    request_id=request.id,
                    status="error",
                    error_message="No voice input or text prompt provided",
                    completed_at=datetime.utcnow()
                )
            
            # Step 3: Process the command (this would integrate with other MCP services)
            response_text = await self._process_voice_command_text(command_text, request)
            
            # Step 4: Generate voice response
            voice_output = ""
            if response_text:
                voice_output = await self.synthesize_speech(
                    response_text,
                    voice_type="explanation"
                )
            
            execution_time = (datetime.utcnow() - start_time).total_seconds()
            
            return MCPResponse(
                request_id=request.id,
                status="success",
                result={
                    "recognized_text": recognized_text,
                    "command_text": command_text,
                    "response_text": response_text
                },
                explanation=response_text,
                voice_output=voice_output,
                execution_time=execution_time,
                completed_at=datetime.utcnow()
            )
            
        except Exception as e:
            logger.error(f"Error processing voice command: {e}")
            return MCPResponse(
                request_id=request.id,
                status="error",
                error_message=str(e),
                completed_at=datetime.utcnow()
            )
    
    async def _process_voice_command_text(self, command_text: str, 
                                       request: VoiceCommandRequest) -> str:
        """Process voice command text and generate response"""
        try:
            # This would integrate with the main MCP processing pipeline
            # For now, provide basic voice command handling
            
            command_lower = command_text.lower()
            
            if "generate code" in command_lower:
                return self._handle_code_generation_command(command_text, request)
            elif "debug" in command_lower or "error" in command_lower:
                return self._handle_debugging_command(command_text, request)
            elif "explain" in command_lower:
                return self._handle_explanation_command(command_text, request)
            elif "help" in command_lower:
                return self._handle_help_command()
            else:
                return f"I heard: '{command_text}'. How can I help you with your development tasks?"
                
        except Exception as e:
            logger.error(f"Error processing voice command text: {e}")
            return "I'm sorry, I had trouble processing your voice command."
    
    def _handle_code_generation_command(self, command: str, request: VoiceCommandRequest) -> str:
        """Handle code generation voice commands"""
        return f"I understand you want to generate code. Based on your command: '{command}', I'll help you create the code you need. Please provide more specific requirements through the voice interface or text input."
    
    def _handle_debugging_command(self, command: str, request: VoiceCommandRequest) -> str:
        """Handle debugging voice commands"""
        return f"I'm ready to help you debug. From your command: '{command}', I understand you're experiencing an issue. Please share the error message or describe the problem you're facing."
    
    def _handle_explanation_command(self, command: str, request: VoiceCommandRequest) -> str:
        """Handle explanation voice commands"""
        return f"I'll explain what you need to know. Based on: '{command}', please share the code or concept you'd like me to explain, and I'll provide a clear explanation."
    
    def _handle_help_command(self) -> str:
        """Handle help voice commands"""
        return """I'm your AI development assistant with voice capabilities. You can ask me to:
        
        - Generate code by saying 'generate code for...'
        - Debug issues by saying 'help me debug...'
        - Explain code by saying 'explain this code...'
        - Review code by saying 'review my code...'
        - Design architecture by saying 'design architecture for...'
        
        Just speak naturally and I'll understand your development needs."""
    
    async def create_audio_response(self, text_response: str, 
                                  response_type: str = "explanation") -> str:
        """Create an audio response for any text output"""
        try:
            # Choose appropriate voice based on response type
            voice_type = "explanation"
            if "code" in response_type.lower():
                voice_type = "code_narration"
            
            # Synthesize speech
            audio_base64 = await self.synthesize_speech(text_response, voice_type)
            
            return audio_base64
            
        except Exception as e:
            logger.error(f"Error creating audio response: {e}")
            return ""
    
    def get_voice_settings(self) -> Dict[str, Any]:
        """Get current voice synthesis settings"""
        return self.voice_settings
    
    def update_voice_settings(self, voice_type: str, settings: Dict[str, Any]):
        """Update voice synthesis settings"""
        if voice_type in self.voice_settings:
            self.voice_settings[voice_type].update(settings)
            logger.info(f"Updated voice settings for {voice_type}")
        else:
            logger.warning(f"Unknown voice type: {voice_type}")
    
    async def health_check(self) -> Dict[str, Any]:
        """Check the health of Riva services"""
        health_status = {
            "riva_available": self.is_available,
            "tts_ready": bool(self.tts_client),
            "asr_ready": bool(self.asr_client),
            "fallback_ready": bool(self.fallback_client),
            "server_url": self.config.server_url if self.config else "Not configured"
        }
        
        if self.is_available and self.tts_client:
            try:
                # Test TTS with a simple phrase
                test_audio = await self.synthesize_speech("Test", "default")
                health_status["tts_test"] = "success" if test_audio else "failed"
            except Exception as e:
                health_status["tts_test"] = f"failed: {e}"
        
        return health_status
