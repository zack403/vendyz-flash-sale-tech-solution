import { Module } from '@nestjs/common';
import { InternalAuthGuard } from './internal-auth.guard';

@Module({
  providers: [InternalAuthGuard],
  exports: [InternalAuthGuard],
})
export class AuthModule {}
