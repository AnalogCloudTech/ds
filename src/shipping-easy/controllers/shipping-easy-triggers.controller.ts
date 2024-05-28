import { Controller, Post } from '@nestjs/common';
import { ShippingEasyService } from '@/shipping-easy/shipping-easy.service';
import { ApiKeyOnly } from '@/auth/auth.service';

@Controller('shipping-easy-triggers')
export class ShippingEasyTriggersController {
  constructor(private readonly shippingEasyService: ShippingEasyService) {}

  @ApiKeyOnly()
  @Post('handle-shipping-easy-scheduler')
  async handleShippingEasyScheduler() {
    return this.shippingEasyService.handleShippingEasyScheduler();
  }
}
