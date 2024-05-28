import { Module } from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { FacebookController } from './facebook.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Facebook, FacebookSchema } from './schemas/facebook.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Facebook.name, schema: FacebookSchema },
    ]),
    HttpModule,
  ],
  controllers: [FacebookController],
  providers: [FacebookService],
})
export class FacebookModule {}
