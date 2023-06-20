import { Request } from 'express';

export type ReqWithUser = Request & {
  user: { id: string; name: string; email: string; roles: string[] };
};
