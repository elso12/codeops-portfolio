import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUser {
  sub: string;
  email: string;
  refreshToken?: string;
}

export const CurrentUser = createParamDecorator(
  (field: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<{ user?: AuthUser }>();
    return field ? req.user?.[field] : req.user;
  },
);
