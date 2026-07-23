import { os } from '@orpc/server';
import { middleware_db } from './middleware/db';
import { middleware_auth } from './middleware/auth';

const procedure_base = os.use(middleware_db);

export const procedure_public = procedure_base;
export const procedure_protected = procedure_base.use(middleware_auth);
