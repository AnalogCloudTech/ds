import { QrCodeService } from './qr-code.service';
import { CreateQrCodeDto } from './dto/create-qr-code.dto';
export declare class QrCodeController {
    private readonly qrCodeService;
    constructor(qrCodeService: QrCodeService);
    create(createQrCodeDto: CreateQrCodeDto): Promise<string>;
}
