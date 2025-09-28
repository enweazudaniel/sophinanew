-- Fix notifications table to handle user_type properly
ALTER TABLE notifications 
DROP CONSTRAINT IF EXISTS notifications_user_type_check;

-- Make user_type nullable and provide default value
ALTER TABLE notifications 
ALTER COLUMN user_type DROP NOT NULL;
ALTER TABLE notifications 
ALTER COLUMN user_type SET DEFAULT 'student';

-- Update existing notifications without user_type
UPDATE notifications 
SET user_type = 'student' 
WHERE user_type IS NULL;

-- Add proper constraint
ALTER TABLE notifications 
ADD CONSTRAINT notifications_user_type_check 
CHECK (user_type IN ('student', 'teacher', 'admin'));

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_type ON notifications(user_type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
</merged_code>
