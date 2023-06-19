import { Request } from 'express';

export type ReqWithUser = Request & {
  user: { sub: string; name: string; iat: number; exp: number };
};
