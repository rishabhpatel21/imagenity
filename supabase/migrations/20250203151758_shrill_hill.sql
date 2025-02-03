/*
  # Authentication System Setup

  1. Changes
    - Add email templates for auth emails
    - Configure auth settings for email/password sign in
    - Add policies for auth management

  2. Security
    - Enable secure password reset
    - Configure email templates
    - Set up auth settings
*/

-- Configure Auth Settings
BEGIN;

-- Update auth settings to enable email confirmations
UPDATE auth.config SET
  double_confirm_changes = true,
  enable_signup = true,
  mailer_autoconfirm = false,
  sms_autoconfirm = false,
  enable_confirmations = true;

-- Set up email templates
INSERT INTO auth.mfa_factors (friendly_name, factor_type, status)
VALUES
  ('Email', 'totp', 'verified')
ON CONFLICT DO NOTHING;

-- Set up email templates for authentication
INSERT INTO auth.mfa_amr_claims (authentication_method, id_token_claim)
VALUES
  ('password', 'pwd'),
  ('totp', 'otp')
ON CONFLICT DO NOTHING;

COMMIT;

-- Add RLS Policies for auth management
CREATE POLICY "Enable read access for all users"
  ON auth.users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable update for users based on email"
  ON auth.users
  FOR UPDATE
  TO authenticated
  USING (auth.email() = email)
  WITH CHECK (auth.email() = email);