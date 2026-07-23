/** Map common Supabase Auth error strings to clearer user-facing English. */
const SUPABASE_AUTH_MESSAGES: Record<string, string> = {
  'invalid login credentials': 'Incorrect email or password.',
  'invalid email or password': 'Incorrect email or password.',
  'email not confirmed': 'Your email address has not been confirmed yet.',
  'user already registered': 'An account with this email already exists.',
  'already registered': 'An account with this email already exists.',
  'password should be at least 6 characters':
    'Password must be at least 6 characters.',
  'signup requires a valid password': 'Enter a valid password.',
  'unable to validate email address: invalid format':
    'That email address does not look valid.',
  'email rate limit exceeded':
    'Too many attempts. Please try again in a little while.',
  'token has expired or is invalid':
    'Your session expired. Please sign in again.',
  'invalid refresh token': 'Your session is invalid. Please sign in again.',
  'new password should be different from the old password':
    'Your new password must be different from the old one.',
  'auth session missing': 'No session found. Please sign in again.',
  otp_expired:
    'This link has expired. Please request a new password reset link.',
  'auth-callback-error':
    'Could not verify the link. Please request a new password reset link.',
  access_denied:
    'This action was denied. Please request a new password reset link.',
  'otp has expired or is invalid':
    'This link has expired. Please request a new password reset link.',
  'email link is invalid or has expired':
    'This link is invalid or has expired. Please request a new password reset link.',
};

export function toUserFacingSupabaseAuthMessage(message: string) {
  const trimmed = message.trim();
  const lower = trimmed.toLowerCase();

  const exact = SUPABASE_AUTH_MESSAGES[lower];
  if (exact) return exact;

  if (
    lower.startsWith('for security purposes, you can only request this after')
  )
    return 'For security reasons, please wait a moment and try again.';

  return trimmed;
}
