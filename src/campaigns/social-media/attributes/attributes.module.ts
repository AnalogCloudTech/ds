import { Module } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { AttributesController } from './attributes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Attributes } from '@/customers/customers/domain/attributes';
import { AttributeSchema } from './schemas/attributes.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attributes.name, schema: AttributeSchema },
    ]),
  ],
  controllers: [AttributesController],
  providers: [AttributesService],
})
export class AttributesModule {}
