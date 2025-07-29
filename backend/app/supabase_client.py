"""
Supabase client configuration for Luna Services backend
Provides centralized access to Supabase features including auth, database, and real-time
"""
from supabase import create_client, Client
from typing import Optional, Dict, Any
import os
import logging

logger = logging.getLogger(__name__)

class SupabaseManager:
    """
    Centralized Supabase client manager
    Handles both admin and user-level operations
    """
    
    def __init__(self):
        self.url = os.getenv("VITE_SUPABASE_URL", "https://tnmsadjdeenhysllhyzp.supabase.co")
        self.service_key = os.getenv("SUPABASE_SERVICE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRubXNhZGpkZWVuaHlzbGxoeXpwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzgwMjkwMiwiZXhwIjoyMDY5Mzc4OTAyfQ.VxxRTi1YX05_lZYNiW1FZk1oxTyT6QkPaRiSGTPtjcI")
        self.anon_key = os.getenv("VITE_SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRubXNhZGpkZWVuaHlzbGxoeXpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MDI5MDIsImV4cCI6MjA2OTM3ODkwMn0.nQXubx2f5EdzcB2sRLjyytgj9dIiJ5FXQ9gxw5YJsaI")
        self.jwt_secret = os.getenv("SUPABASE_JWT_SECRET", "1027f060-236b-4043-a83f-54fc361b0818")
        
        # Database connection details
        self.db_host = os.getenv("SUPABASE_DB_HOST", "db.tnmsadjdeenhysllhyzp.supabase.co")
        self.db_port = os.getenv("SUPABASE_DB_PORT", "5432")
        self.db_name = os.getenv("SUPABASE_DB_NAME", "postgres")
        self.db_user = os.getenv("SUPABASE_DB_USER", "postgres")
        self.db_password = os.getenv("SUPABASE_DB_PASSWORD", "JglPPLffmXPYaDzS")
        
        # Initialize clients
        self._admin_client: Optional[Client] = None
        self._user_client: Optional[Client] = None
        
        if not self.url or not self.service_key or not self.anon_key:
            logger.warning("Supabase configuration incomplete. Check environment variables.")
        else:
            logger.info(f"Supabase client initialized with URL: {self.url}")
    
    @property
    def admin_client(self) -> Client:
        """Get admin client with service role permissions"""
        if self._admin_client is None:
            self._admin_client = create_client(self.url, self.service_key)
        return self._admin_client
    
    @property
    def user_client(self) -> Client:
        """Get user client with anon key permissions"""
        if self._user_client is None:
            self._user_client = create_client(self.url, self.anon_key)
        return self._user_client
    
    def get_authenticated_client(self, access_token: str) -> Client:
        """
        Get client with user authentication
        
        Args:
            access_token: User's JWT access token
            
        Returns:
            Authenticated Supabase client
        """
        client = create_client(self.url, self.anon_key)
        client.auth.set_session(access_token, "")
        return client
    
    async def verify_connection(self) -> bool:
        """
        Verify Supabase connection is working
        
        Returns:
            True if connection is successful, False otherwise
        """
        try:
            # Test connection by fetching auth settings
            response = self.admin_client.auth.admin.get_user_by_id("test")
            return True
        except Exception as e:
            logger.error(f"Supabase connection failed: {e}")
            return False
    
    async def create_user(self, email: str, password: str, metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Create a new user in Supabase Auth
        
        Args:
            email: User's email address
            password: User's password
            metadata: Additional user metadata
            
        Returns:
            User creation response
        """
        try:
            response = self.admin_client.auth.admin.create_user({
                "email": email,
                "password": password,
                "user_metadata": metadata or {},
                "email_confirm": True
            })
            return {"success": True, "user": response.user}
        except Exception as e:
            logger.error(f"User creation failed: {e}")
            return {"success": False, "error": str(e)}
    
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """
        Get user by email address
        
        Args:
            email: User's email address
            
        Returns:
            User data if found, None otherwise
        """
        try:
            response = self.admin_client.auth.admin.list_users()
            for user in response.users:
                if user.email == email:
                    return user.__dict__
            return None
        except Exception as e:
            logger.error(f"User lookup failed: {e}")
            return None
    
    async def update_user_metadata(self, user_id: str, metadata: Dict[str, Any]) -> bool:
        """
        Update user metadata
        
        Args:
            user_id: User's ID
            metadata: Metadata to update
            
        Returns:
            True if successful, False otherwise
        """
        try:
            self.admin_client.auth.admin.update_user_by_id(user_id, {
                "user_metadata": metadata
            })
            return True
        except Exception as e:
            logger.error(f"User metadata update failed: {e}")
            return False
    
    def get_table(self, table_name: str, admin: bool = False) -> Any:
        """
        Get table client for database operations
        
        Args:
            table_name: Name of the table
            admin: Whether to use admin client
            
        Returns:
            Table client
        """
        client = self.admin_client if admin else self.user_client
        return client.table(table_name)

# Global Supabase manager instance
supabase_manager = SupabaseManager()

# Convenience functions for backward compatibility
def get_supabase_client(service_role: bool = False) -> Client:
    """Get Supabase client"""
    return supabase_manager.admin_client if service_role else supabase_manager.user_client

def get_supabase() -> Client:
    """Get user Supabase client"""
    return supabase_manager.user_client

def get_supabase_admin() -> Client:
    """Get admin Supabase client"""
    return supabase_manager.admin_client