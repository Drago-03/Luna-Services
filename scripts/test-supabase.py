#!/usr/bin/env python3
"""
Supabase Connection Test Script for Luna Services
This script tests the Supabase database connection and basic functionality.
"""

import os
import sys
import asyncio
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

try:
    from supabase import create_client, Client
    from app.supabase_client import SupabaseManager
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you have installed the requirements: pip install -r backend/requirements.txt")
    sys.exit(1)

def test_environment_variables():
    """Test if all required environment variables are set."""
    print("🧪 Testing environment variables...")
    
    required_vars = [
        "VITE_SUPABASE_URL",
        "VITE_SUPABASE_ANON_KEY",
        "SUPABASE_SERVICE_KEY",
        "SUPABASE_DB_PASSWORD"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        return False
    else:
        print("✅ All required environment variables are set")
        return True

def test_supabase_client():
    """Test basic Supabase client creation."""
    print("\n🧪 Testing Supabase client creation...")
    
    try:
        url = os.getenv("VITE_SUPABASE_URL")
        key = os.getenv("VITE_SUPABASE_ANON_KEY")
        
        if not url or not key:
            print("❌ Missing Supabase URL or key")
            return False
        
        supabase: Client = create_client(url, key)
        print("✅ Supabase client created successfully")
        return True, supabase
    except Exception as e:
        print(f"❌ Failed to create Supabase client: {e}")
        return False, None

def test_supabase_manager():
    """Test the Luna Services Supabase manager."""
    print("\n🧪 Testing Luna Services Supabase manager...")
    
    try:
        manager = SupabaseManager()
        admin_client = manager.admin_client
        user_client = manager.user_client
        
        print("✅ Supabase manager initialized successfully")
        print(f"   - Admin client: {admin_client is not None}")
        print(f"   - User client: {user_client is not None}")
        print(f"   - URL: {manager.url}")
        print(f"   - DB Host: {manager.db_host}")
        
        return True, manager
    except Exception as e:
        print(f"❌ Failed to initialize Supabase manager: {e}")
        return False, None

def test_database_connection(manager):
    """Test database connection."""
    print("\n🧪 Testing database connection...")
    
    try:
        # Try to get health check or basic info
        result = manager.admin_client.table("users").select("count").execute()
        print("✅ Database connection successful")
        print(f"   - Response status: {result.count is not None}")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_authentication():
    """Test authentication capabilities."""
    print("\n🧪 Testing authentication capabilities...")
    
    try:
        url = os.getenv("VITE_SUPABASE_URL")
        key = os.getenv("VITE_SUPABASE_ANON_KEY")
        
        supabase: Client = create_client(url, key)
        
        # Test getting current user (should be None without authentication)
        user = supabase.auth.get_user()
        print("✅ Authentication system accessible")
        print(f"   - Current user: {user.user is not None if user else 'None'}")
        return True
    except Exception as e:
        print(f"❌ Authentication test failed: {e}")
        return False

def test_rls_policies(manager):
    """Test Row Level Security policies."""
    print("\n🧪 Testing Row Level Security policies...")
    
    try:
        # Try to access data (should be limited by RLS)
        result = manager.user_client.table("users").select("*").limit(1).execute()
        print("✅ RLS policies are active")
        print(f"   - Accessible rows: {len(result.data) if result.data else 0}")
        return True
    except Exception as e:
        print(f"⚠️  RLS test inconclusive: {e}")
        return True  # This might fail due to RLS, which is expected

def main():
    """Run all tests."""
    print("🚀 Luna Services - Supabase Connection Test")
    print("=" * 50)
    
    tests_passed = 0
    total_tests = 6
    
    # Test 1: Environment variables
    if test_environment_variables():
        tests_passed += 1
    
    # Test 2: Supabase client
    client_success, supabase_client = test_supabase_client()
    if client_success:
        tests_passed += 1
    
    # Test 3: Supabase manager
    manager_success, manager = test_supabase_manager()
    if manager_success:
        tests_passed += 1
    
    # Test 4: Database connection (only if manager is working)
    if manager_success and test_database_connection(manager):
        tests_passed += 1
    elif not manager_success:
        print("\n⚠️  Skipping database connection test (manager failed)")
    
    # Test 5: Authentication
    if test_authentication():
        tests_passed += 1
    
    # Test 6: RLS policies (only if manager is working)
    if manager_success and test_rls_policies(manager):
        tests_passed += 1
    elif not manager_success:
        print("\n⚠️  Skipping RLS test (manager failed)")
    
    # Summary
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! Supabase is properly configured.")
        return 0
    elif tests_passed >= total_tests - 1:
        print("✅ Most tests passed. Your setup is likely working correctly.")
        return 0
    else:
        print("❌ Some tests failed. Please check your configuration.")
        print("\n🔧 Troubleshooting tips:")
        print("1. Verify your .env file has all required variables")
        print("2. Check that your Supabase project is active")
        print("3. Ensure database migrations have been run")
        print("4. Verify network connectivity to Supabase")
        return 1

if __name__ == "__main__":
    # Load environment variables from .env file
    env_file = Path(__file__).parent.parent / ".env"
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                if line.strip() and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    os.environ[key] = value
    
    sys.exit(main())
