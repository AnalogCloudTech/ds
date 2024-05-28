import { Module } from '@nestjs/common';
import { ApiKeysModule } from '@/auth/api-keys/api-keys.module';
import { ApiKeyStrategy } from './api-key.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PaymentsChargifyModule } from '@/payments/payment_chargify/payments.module';
import { CustomersModule } from '@/customers/customers/customers.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('auth.jwtSecret');
        const expiresIn = configService.get<string>('auth.jwtExpiration');
        const signOptions: JwtSignOptions = {
          expiresIn,
        };
        return {
          secret,
          signOptions,
        };
      },
    }),
    ApiKeysModule,
    PaymentsChargifyModule,
    CustomersModule,
  ],
  providers: [AuthService, ApiKeyStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
