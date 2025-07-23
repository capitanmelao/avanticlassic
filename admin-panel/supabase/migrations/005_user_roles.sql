-- Migration 005: User Roles and Audit Logging
-- Two-tier admin architecture implementation
-- Created: July 14, 2025

-- Add user roles and permissions to admin_users table
ALTER TABLE admin_users 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'company_admin',
ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES admin_users(id),
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Create role constraint
ALTER TABLE admin_users 
ADD CONSTRAINT IF NOT EXISTS valid_role 
CHECK (role IN ('company_admin', 'super_admin'));

-- Create status constraint
ALTER TABLE admin_users 
ADD CONSTRAINT IF NOT EXISTS valid_status 
CHECK (status IN ('active', 'inactive', 'suspended'));

-- Create audit logging table
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES admin_users(id),
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(50),
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_user_id ON admin_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON admin_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_table_name ON admin_audit_log(table_name);

-- Update existing admin user to super_admin (Carlos)
UPDATE admin_users 
SET role = 'super_admin', 
    permissions = '{"all": true}',
    status = 'active'
WHERE email = 'carloszamalloa@gmail.com';

-- Row Level Security (RLS) policies for audit_log
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own audit logs (company admins)
CREATE POLICY IF NOT EXISTS "Users can view own audit logs" ON admin_audit_log
FOR SELECT USING (user_id = auth.uid());

-- Policy: Super admins can see all audit logs
CREATE POLICY IF NOT EXISTS "Super admins can view all audit logs" ON admin_audit_log
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.id = auth.uid() 
    AND admin_users.role = 'super_admin'
  )
);

-- Policy: Only authenticated admins can insert audit logs
CREATE POLICY IF NOT EXISTS "Authenticated admins can insert audit logs" ON admin_audit_log
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.id = auth.uid()
  )
);

-- Update RLS policies for admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY IF NOT EXISTS "Users can view own profile" ON admin_users
FOR SELECT USING (id = auth.uid());

-- Policy: Super admins can view all users
CREATE POLICY IF NOT EXISTS "Super admins can view all users" ON admin_users
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM admin_users AS current_user
    WHERE current_user.id = auth.uid() 
    AND current_user.role = 'super_admin'
  )
);

-- Policy: Super admins can insert new users
CREATE POLICY IF NOT EXISTS "Super admins can insert users" ON admin_users
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users AS current_user
    WHERE current_user.id = auth.uid() 
    AND current_user.role = 'super_admin'
  )
);

-- Policy: Super admins can update users
CREATE POLICY IF NOT EXISTS "Super admins can update users" ON admin_users
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM admin_users AS current_user
    WHERE current_user.id = auth.uid() 
    AND current_user.role = 'super_admin'
  )
);

-- Policy: Users can update their own profile (limited fields)
CREATE POLICY IF NOT EXISTS "Users can update own profile" ON admin_users
FOR UPDATE USING (id = auth.uid())
WITH CHECK (
  id = auth.uid() 
  AND role = (SELECT role FROM admin_users WHERE id = auth.uid()) -- Prevent role escalation
);

-- Policy: Super admins can delete users
CREATE POLICY IF NOT EXISTS "Super admins can delete users" ON admin_users
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM admin_users AS current_user
    WHERE current_user.id = auth.uid() 
    AND current_user.role = 'super_admin'
  )
);

-- Function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  p_action VARCHAR(100),
  p_table_name VARCHAR(50),
  p_record_id UUID DEFAULT NULL,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  INSERT INTO admin_audit_log (
    user_id, 
    action, 
    table_name, 
    record_id, 
    old_data, 
    new_data,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    p_action,
    p_table_name,
    p_record_id,
    p_old_data,
    p_new_data,
    inet_client_addr(),
    current_setting('request.headers')::json->>'user-agent'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION log_admin_action TO authenticated;

-- Create trigger function for automatic audit logging
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM log_admin_action(
      'DELETE',
      TG_TABLE_NAME,
      OLD.id,
      row_to_json(OLD),
      NULL
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_admin_action(
      'UPDATE',
      TG_TABLE_NAME,
      NEW.id,
      row_to_json(OLD),
      row_to_json(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    PERFORM log_admin_action(
      'INSERT',
      TG_TABLE_NAME,
      NEW.id,
      NULL,
      row_to_json(NEW)
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers for all content tables
CREATE TRIGGER audit_artists_trigger
  AFTER INSERT OR UPDATE OR DELETE ON artists
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_releases_trigger
  AFTER INSERT OR UPDATE OR DELETE ON releases
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_videos_trigger
  AFTER INSERT OR UPDATE OR DELETE ON videos
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_playlists_trigger
  AFTER INSERT OR UPDATE OR DELETE ON playlists
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_reviews_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_distributors_trigger
  AFTER INSERT OR UPDATE OR DELETE ON distributors
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_admin_users_trigger
  AFTER INSERT OR UPDATE OR DELETE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Update admin_users table constraints
ALTER TABLE admin_users 
ADD CONSTRAINT IF NOT EXISTS admin_users_email_unique UNIQUE (email);

-- Comment the tables for documentation
COMMENT ON TABLE admin_audit_log IS 'Audit trail for all administrative actions';
COMMENT ON COLUMN admin_users.role IS 'Admin role: company_admin or super_admin';
COMMENT ON COLUMN admin_users.permissions IS 'JSON object containing specific permissions';
COMMENT ON COLUMN admin_users.created_by IS 'ID of the admin who created this user';
COMMENT ON COLUMN admin_users.last_login IS 'Timestamp of last successful login';
COMMENT ON COLUMN admin_users.status IS 'Account status: active, inactive, or suspended';