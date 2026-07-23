import { procedure_public } from '@/integrations/orpc/procedure';
import { getClientSession } from './get-client-session';

export const orpc_getAuthSession = procedure_public
  .route({ method: 'GET' })
  .handler(() => getClientSession())
  .callable();
