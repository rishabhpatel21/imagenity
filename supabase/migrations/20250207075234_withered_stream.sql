/*
  # Add additional fields to user_profiles table

  1. Changes
    - Add company_name column (optional)
    - Add position column (optional)
    - Add state_name column (required)
    - Add country_name column (required)
    - Update mobile_number to be NOT NULL
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS company_name text,
ADD COLUMN IF NOT EXISTS position text,
ADD COLUMN IF NOT EXISTS state_name text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS country_name text NOT NULL DEFAULT '';

-- Make mobile_number required
ALTER TABLE user_profiles
ALTER COLUMN mobile_number SET NOT NULL;

-- Remove the default values after altering
ALTER TABLE user_profiles
ALTER COLUMN state_name DROP DEFAULT,
ALTER COLUMN country_name DROP DEFAULT;

-- Update trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_user_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_user_profiles_updated_at
      BEFORE UPDATE ON user_profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END
$$;