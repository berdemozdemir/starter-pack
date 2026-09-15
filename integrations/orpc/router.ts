import { orpc_getAuthSession } from '@/modules/auth/actions/get-auth-session';
import { orpc_login } from '@/modules/auth/actions/login';
import { orpc_signup } from '@/modules/auth/actions/signup';
import { orpc_example_createItem } from '@/modules/example/actions/create-item';
import { orpc_example_deleteItem } from '@/modules/example/actions/delete-item';
import { orpc_example_listAll } from '@/modules/example/actions/list-all';
import { orpc_example_listMine } from '@/modules/example/actions/list-mine';

export const router = {
  auth: {
    login: orpc_login,
    signup: orpc_signup,
    getAuthSession: orpc_getAuthSession,
  },
  example: {
    listMine: orpc_example_listMine,
    listAll: orpc_example_listAll,
    create: orpc_example_createItem,
    delete: orpc_example_deleteItem,
  },
} as const;
