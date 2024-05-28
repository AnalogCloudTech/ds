import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiKeyOnly, AuthService, Public } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('user'))
  @Post('login')
  async login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @ApiKeyOnly()
  @Get('subscriptions/:email')
  async getSubscriptions(@Param('email') email: string) {
    return this.authService.buildSubscriptionsTypeResponse(email);
  }
}
