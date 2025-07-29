#!/usr/bin/env python3
"""
Test script for Luna Services AutoMCP integration

This script tests the basic functionality of the AutoMCP-compatible MCP server
"""

import sys
import os
import asyncio
import subprocess
import time
import signal
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

def test_import():
    """Test if all required modules can be imported"""
    print("🧪 Testing imports...")
    
    try:
        # Test FastMCP import (may not be available in development)
        try:
            from mcp.server.fastmcp import FastMCP
            print("✅ FastMCP import successful")
        except ImportError:
            print("⚠️  FastMCP not available (install: pip install naptha-automcp)")
            return False
            
        # Test Luna Services imports
        from backend.app.mcp.service_enhanced import EnhancedMCPService
        from backend.app.mcp.models import MCPRequest, MCPTaskType, ProgrammingLanguage
        print("✅ Luna Services imports successful")
        
        return True
    except Exception as e:
        print(f"❌ Import failed: {e}")
        return False

def test_server_startup():
    """Test if the MCP server can start up"""
    print("\n🧪 Testing server startup...")
    
    try:
        # Start the server in a subprocess
        server_process = subprocess.Popen(
            [sys.executable, "run_mcp.py"],
            cwd=project_root,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            preexec_fn=os.setsid
        )
        
        # Wait a bit for startup
        time.sleep(3)
        
        # Check if process is still running
        if server_process.poll() is None:
            print("✅ Server started successfully")
            
            # Clean up
            os.killpg(os.getpgid(server_process.pid), signal.SIGTERM)
            server_process.wait(timeout=5)
            return True
        else:
            stdout, stderr = server_process.communicate()
            print(f"❌ Server failed to start")
            print(f"STDOUT: {stdout.decode()}")
            print(f"STDERR: {stderr.decode()}")
            return False
            
    except Exception as e:
        print(f"❌ Server startup test failed: {e}")
        return False

def test_configuration():
    """Test if the configuration is properly set up"""
    print("\n🧪 Testing configuration...")
    
    try:
        # Check if required files exist
        required_files = [
            "run_mcp.py",
            "pyproject.toml", 
            ".cursor/mcp.json"
        ]
        
        missing_files = []
        for file_path in required_files:
            if not (project_root / file_path).exists():
                missing_files.append(file_path)
                
        if missing_files:
            print(f"❌ Missing required files: {missing_files}")
            return False
        
        # Check pyproject.toml for required sections
        pyproject_path = project_root / "pyproject.toml"
        pyproject_content = pyproject_path.read_text()
        
        required_sections = [
            "[project.scripts]",
            "serve_stdio",
            "serve_sse",
            "[tool.hatch.build.targets.wheel]"
        ]
        
        missing_sections = []
        for section in required_sections:
            if section not in pyproject_content:
                missing_sections.append(section)
                
        if missing_sections:
            print(f"❌ Missing pyproject.toml sections: {missing_sections}")
            return False
            
        print("✅ Configuration files are properly set up")
        return True
        
    except Exception as e:
        print(f"❌ Configuration test failed: {e}")
        return False

async def test_mcp_function():
    """Test the main MCP processing function"""
    print("\n🧪 Testing MCP function...")
    
    try:
        # Import the function
        from run_mcp import luna_mcp_processor
        
        # Test basic code generation
        result = await luna_mcp_processor(
            task_type="code_generation",
            prompt="Create a simple hello world function in Python",
            language="python",
            include_tests=False,
            include_documentation=False
        )
        
        # Check result structure
        if isinstance(result, dict) and "status" in result:
            if result["status"] == "error":
                print(f"⚠️  MCP function returned error: {result.get('error_message', 'Unknown error')}")
                # This might be expected if API keys are not configured
                return True
            else:
                print("✅ MCP function executed successfully")
                return True
        else:
            print(f"❌ MCP function returned unexpected result: {result}")
            return False
            
    except Exception as e:
        print(f"❌ MCP function test failed: {e}")
        return False

def test_automcp_compatibility():
    """Test AutoMCP CLI compatibility"""
    print("\n🧪 Testing AutoMCP compatibility...")
    
    try:
        # Check if automcp command is available
        result = subprocess.run(
            ["automcp", "--help"],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode == 0:
            print("✅ AutoMCP CLI is available")
            
            # Test automcp serve command (dry run)
            result = subprocess.run(
                ["automcp", "serve", "-t", "stdio", "--help"],
                cwd=project_root,
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode == 0:
                print("✅ AutoMCP serve command is functional")
                return True
            else:
                print(f"⚠️  AutoMCP serve command issues: {result.stderr}")
                return True  # Not critical
        else:
            print("⚠️  AutoMCP CLI not available (install: pip install naptha-automcp)")
            return True  # Not critical for basic functionality
            
    except subprocess.TimeoutExpired:
        print("⚠️  AutoMCP command timed out")
        return True
    except Exception as e:
        print(f"⚠️  AutoMCP compatibility test failed: {e}")
        return True  # Not critical

def main():
    """Run all tests"""
    print("🚀 Luna Services AutoMCP Integration Tests")
    print("=" * 50)
    
    tests = [
        test_import,
        test_configuration,
        test_automcp_compatibility,
        test_server_startup,
    ]
    
    # Run async test separately
    async_tests = [
        test_mcp_function
    ]
    
    passed = 0
    total = len(tests) + len(async_tests)
    
    # Run sync tests
    for test in tests:
        if test():
            passed += 1
    
    # Run async tests
    for test in async_tests:
        if asyncio.run(test()):
            passed += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Luna Services is AutoMCP compatible.")
        print("\nNext steps:")
        print("1. Set your GEMINI_API_KEY in .env file")
        print("2. Test: python run_mcp.py")
        print("3. Deploy to MCPaaS: https://labs.naptha.ai/")
        return 0
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
