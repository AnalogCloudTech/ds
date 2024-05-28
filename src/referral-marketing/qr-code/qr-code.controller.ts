import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { QrCodeService } from './qr-code.service';
import { CreateQrCodeDto } from './dto/create-qr-code.dto';

@Controller({ path: 'qrcode', version: '1' })
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @Post()
  public create(
    @Body(ValidationPipe) createQrCodeDto: CreateQrCodeDto,
  ): Promise<string> {
    return this.qrCodeService.create(createQrCodeDto);
  }
}
