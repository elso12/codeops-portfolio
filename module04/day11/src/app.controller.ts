import { Controller, Get } from '@nestjs/common';
import { AuthUser, CurrentUser } from './common/decorators/current-user.decorator';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get('health')
  getHealth() {
    return { status: 'ok' };
  }

  @Get('protected')
  getProtected(@CurrentUser() user: AuthUser) {
    return {
      message: 'You have accessed a protected route',
      user,
    };
  }
}
