import { Injectable } from '@nestjs/common';
import QRCode from 'qrcode';
import { CreateQrCodeDto } from './dto/create-qr-code.dto';

@Injectable()
export class QrCodeService {
  create(createQrCodeDto: CreateQrCodeDto): Promise<string> {
    return QRCode.toDataURL(createQrCodeDto.text);
  }
}
