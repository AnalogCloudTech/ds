import { forwardRef, Module } from '@nestjs/common';
import { CoachesService } from './coaches.service';
import { CoachesController } from './coaches.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coach, CoachSchema } from './schemas/coach.schema';
import { EmailRemindersModule } from '@/onboard/email-reminders/email-reminders.module';
import { CoachesRepository } from '@/onboard/coaches/coaches.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coach.name, schema: CoachSchema }]),
    forwardRef(() => EmailRemindersModule),
  ],
  providers: [CoachesService, CoachesRepository],
  controllers: [CoachesController],
  exports: [CoachesService],
})
export class CoachesModule {}
