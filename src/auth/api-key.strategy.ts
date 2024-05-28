import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiKey } from '@/auth/api-keys/schemas/api-key.schema';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      session: false,
    });
  }

  async validate(apiKey: string): Promise<ApiKey> {
    const user = await this.authService.validateApiKey(apiKey);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
