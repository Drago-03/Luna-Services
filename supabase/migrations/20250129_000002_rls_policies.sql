-- Row Level Security (RLS) Policies for Luna Services
-- Ensures proper data access control based on user authentication and roles

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can read their own data and admins can read all
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Admins can update any user
CREATE POLICY "Admins can update any user" ON public.users
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Only admins can insert new users (typically handled by triggers)
CREATE POLICY "Admins can insert users" ON public.users
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Projects table policies
-- Users can view projects they are members of
CREATE POLICY "Users can view accessible projects" ON public.projects
    FOR SELECT USING (
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM public.project_members 
            WHERE project_id = projects.id AND user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- Users can create projects
CREATE POLICY "Authenticated users can create projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Project owners and admins can update projects
CREATE POLICY "Project owners and admins can update projects" ON public.projects
    FOR UPDATE USING (
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        ) OR
        EXISTS (
            SELECT 1 FROM public.project_members 
            WHERE project_id = projects.id AND user_id = auth.uid() AND role IN ('owner', 'maintainer')
        )
    );

-- Project owners and admins can delete projects
CREATE POLICY "Project owners and admins can delete projects" ON public.projects
    FOR DELETE USING (
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Project members table policies
-- Users can view project members for projects they belong to
CREATE POLICY "Users can view project members" ON public.project_members
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.project_members pm 
            WHERE pm.project_id = project_members.project_id AND pm.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- Project owners can add/remove members
CREATE POLICY "Project owners can manage members" ON public.project_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE id = project_id AND created_by = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.project_members 
            WHERE project_id = project_members.project_id AND user_id = auth.uid() AND role = 'owner'
        ) OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Automation jobs table policies
-- Users can view jobs for projects they have access to
CREATE POLICY "Users can view accessible automation jobs" ON public.automation_jobs
    FOR SELECT USING (
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM public.project_members 
            WHERE project_id = automation_jobs.project_id AND user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- Users can create automation jobs for projects they have access to
CREATE POLICY "Users can create automation jobs" ON public.automation_jobs
    FOR INSERT WITH CHECK (
        auth.uid() = created_by AND (
            project_id IS NULL OR
            EXISTS (
                SELECT 1 FROM public.project_members 
                WHERE project_id = automation_jobs.project_id AND user_id = auth.uid() AND role IN ('owner', 'maintainer', 'developer')
            ) OR
            EXISTS (
                SELECT 1 FROM public.projects 
                WHERE id = automation_jobs.project_id AND created_by = auth.uid()
            )
        )
    );

-- Job creators and project maintainers can update jobs
CREATE POLICY "Authorized users can update automation jobs" ON public.automation_jobs
    FOR UPDATE USING (
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM public.project_members 
            WHERE project_id = automation_jobs.project_id AND user_id = auth.uid() AND role IN ('owner', 'maintainer')
        ) OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Job creators and project owners can delete jobs
CREATE POLICY "Authorized users can delete automation jobs" ON public.automation_jobs
    FOR DELETE USING (
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM public.project_members 
            WHERE project_id = automation_jobs.project_id AND user_id = auth.uid() AND role = 'owner'
        ) OR
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Job executions table policies
-- Users can view executions for jobs they have access to
CREATE POLICY "Users can view accessible job executions" ON public.job_executions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.automation_jobs aj
            WHERE aj.id = job_executions.job_id AND (
                auth.uid() = aj.created_by OR
                EXISTS (
                    SELECT 1 FROM public.project_members 
                    WHERE project_id = aj.project_id AND user_id = auth.uid()
                ) OR
                EXISTS (
                    SELECT 1 FROM public.users 
                    WHERE id = auth.uid() AND role IN ('admin', 'manager')
                )
            )
        )
    );

-- System can create job executions (typically automated)
CREATE POLICY "System can create job executions" ON public.job_executions
    FOR INSERT WITH CHECK (true);

-- System and authorized users can update job executions
CREATE POLICY "Authorized users can update job executions" ON public.job_executions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.automation_jobs aj
            WHERE aj.id = job_executions.job_id AND (
                auth.uid() = aj.created_by OR
                EXISTS (
                    SELECT 1 FROM public.project_members 
                    WHERE project_id = aj.project_id AND user_id = auth.uid() AND role IN ('owner', 'maintainer')
                ) OR
                EXISTS (
                    SELECT 1 FROM public.users 
                    WHERE id = auth.uid() AND role = 'admin'
                )
            )
        )
    );

-- API keys table policies
-- Users can only view and manage their own API keys
CREATE POLICY "Users can manage own API keys" ON public.api_keys
    FOR ALL USING (auth.uid() = user_id);

-- Admins can view all API keys
CREATE POLICY "Admins can view all API keys" ON public.api_keys
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
