import { CreateQrCodeDto } from './dto/create-qr-code.dto';
export declare class QrCodeService {
    create(createQrCodeDto: CreateQrCodeDto): Promise<string>;
}
