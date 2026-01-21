import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class InternalAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const tokenFromHeader = request.headers['x-internal-service-token'];

    if (!tokenFromHeader || Array.isArray(tokenFromHeader)) {
      throw new UnauthorizedException('Missing internal service token');
    }

    const expectedToken = this.configService.get<string>(
      'INTERNAL_SERVICE_TOKEN',
    );

    if (!expectedToken) {
      throw new Error('INTERNAL_SERVICE_TOKEN is not configured');
    }

    if (tokenFromHeader !== expectedToken) {
      throw new UnauthorizedException('Invalid internal service token');
    }

    return true;
  }
}
