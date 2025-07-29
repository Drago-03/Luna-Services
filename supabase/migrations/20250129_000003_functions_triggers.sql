-- Functions and Triggers for Luna Services
-- Handles automatic user creation, statistics, and other business logic

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, role, created_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'developer'),
        NEW.created_at
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update automation job statistics
CREATE OR REPLACE FUNCTION public.update_job_statistics()
RETURNS TRIGGER AS $$
DECLARE
    job_record RECORD;
    total_executions INTEGER;
    successful_executions INTEGER;
    avg_duration_val INTEGER;
BEGIN
    -- Get job statistics
    SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'completed') as successful,
        ROUND(AVG(duration)) as avg_dur
    INTO total_executions, successful_executions, avg_duration_val
    FROM public.job_executions 
    WHERE job_id = NEW.job_id;

    -- Update automation job statistics
    UPDATE public.automation_jobs 
    SET 
        success_rate = CASE 
            WHEN total_executions > 0 THEN ROUND((successful_executions::FLOAT / total_executions::FLOAT) * 100)
            ELSE 100 
        END,
        avg_duration = COALESCE(avg_duration_val, 0),
        last_run = CASE 
            WHEN NEW.status IN ('completed', 'failed') THEN NEW.completed_at
            ELSE last_run
        END,
        updated_at = NOW()
    WHERE id = NEW.job_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update job statistics when execution completes
DROP TRIGGER IF EXISTS on_job_execution_completed ON public.job_executions;
CREATE TRIGGER on_job_execution_completed
    AFTER UPDATE ON public.job_executions
    FOR EACH ROW 
    WHEN (OLD.status != NEW.status AND NEW.status IN ('completed', 'failed'))
    EXECUTE FUNCTION public.update_job_statistics();

-- Function to automatically add project creator as owner
CREATE OR REPLACE FUNCTION public.add_project_creator_as_owner()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.project_members (project_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'owner');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to add project creator as owner
DROP TRIGGER IF EXISTS on_project_created ON public.projects;
CREATE TRIGGER on_project_created
    AFTER INSERT ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.add_project_creator_as_owner();

-- Function to get user dashboard statistics
CREATE OR REPLACE FUNCTION public.get_user_dashboard_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_projects', (
            SELECT COUNT(*) 
            FROM public.projects p
            LEFT JOIN public.project_members pm ON p.id = pm.project_id
            WHERE p.created_by = user_uuid OR pm.user_id = user_uuid
        ),
        'active_jobs', (
            SELECT COUNT(*) 
            FROM public.automation_jobs 
            WHERE created_by = user_uuid AND status = 'active'
        ),
        'running_jobs', (
            SELECT COUNT(*) 
            FROM public.automation_jobs 
            WHERE created_by = user_uuid AND status = 'running'
        ),
        'recent_executions', (
            SELECT COUNT(*) 
            FROM public.job_executions je
            JOIN public.automation_jobs aj ON je.job_id = aj.id
            WHERE aj.created_by = user_uuid 
            AND je.started_at > NOW() - INTERVAL '24 hours'
        ),
        'success_rate', (
            SELECT ROUND(AVG(success_rate))
            FROM public.automation_jobs 
            WHERE created_by = user_uuid AND status != 'error'
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get project statistics
CREATE OR REPLACE FUNCTION public.get_project_stats(project_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_jobs', (
            SELECT COUNT(*) 
            FROM public.automation_jobs 
            WHERE project_id = project_uuid
        ),
        'active_jobs', (
            SELECT COUNT(*) 
            FROM public.automation_jobs 
            WHERE project_id = project_uuid AND status = 'active'
        ),
        'total_executions', (
            SELECT COUNT(*) 
            FROM public.job_executions je
            JOIN public.automation_jobs aj ON je.job_id = aj.id
            WHERE aj.project_id = project_uuid
        ),
        'recent_executions', (
            SELECT COUNT(*) 
            FROM public.job_executions je
            JOIN public.automation_jobs aj ON je.job_id = aj.id
            WHERE aj.project_id = project_uuid 
            AND je.started_at > NOW() - INTERVAL '24 hours'
        ),
        'avg_success_rate', (
            SELECT ROUND(AVG(success_rate))
            FROM public.automation_jobs 
            WHERE project_id = project_uuid AND status != 'error'
        ),
        'member_count', (
            SELECT COUNT(*) 
            FROM public.project_members 
            WHERE project_id = project_uuid
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old job executions (keep last 100 per job)
CREATE OR REPLACE FUNCTION public.cleanup_old_executions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER := 0;
    job_rec RECORD;
BEGIN
    FOR job_rec IN 
        SELECT DISTINCT job_id FROM public.job_executions
    LOOP
        DELETE FROM public.job_executions 
        WHERE job_id = job_rec.job_id 
        AND id NOT IN (
            SELECT id 
            FROM public.job_executions 
            WHERE job_id = job_rec.job_id 
            ORDER BY started_at DESC 
            LIMIT 100
        );
        
        GET DIAGNOSTICS deleted_count = deleted_count + ROW_COUNT;
    END LOOP;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to validate cron expressions (basic validation)
CREATE OR REPLACE FUNCTION public.validate_cron_expression(cron_expr TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Basic cron validation (5 or 6 fields)
    IF cron_expr IS NULL THEN
        RETURN TRUE; -- Allow NULL for manual jobs
    END IF;
    
    -- Check if it has 5 or 6 space-separated fields
    IF array_length(string_to_array(cron_expr, ' '), 1) NOT IN (5, 6) THEN
        RETURN FALSE;
    END IF;
    
    -- Add more sophisticated validation here if needed
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Add constraint to validate cron expressions
ALTER TABLE public.automation_jobs 
ADD CONSTRAINT valid_cron_schedule 
CHECK (public.validate_cron_expression(schedule));
