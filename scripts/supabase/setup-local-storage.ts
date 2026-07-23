import { ConsoleLogger } from '@/scripts/utils/console-logger';

/**
 * Optional storage bootstrap for local Supabase.
 * This starter ships without buckets — add names + RLS policies when your product needs them.
 */
ConsoleLogger.info(
  '[storage] No buckets configured. Storage is optional — add buckets and policies under integrations/supabase/policies/ when needed.',
);
