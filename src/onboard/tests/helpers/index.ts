import { CoachDocument } from '@/onboard/coaches/schemas/coach.schema';
import { faker } from '@faker-js/faker';
import { CoachesService } from '@/onboard/coaches/coaches.service';
import { UpdateCoachDto } from '@/onboard/coaches/dto/update-coach.dto';
import { OnboardService } from '@/onboard/onboard.service';
import { CreateOfferDto } from '@/onboard/dto/create-offer.dto';
import { OfferType } from '@/onboard/domain/types';

export async function createCoach(
  coachesService: CoachesService,
  toOverride: Partial<CoachDocument> = {},
): Promise<CoachDocument> {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const name = `${firstName} ${lastName}`;
  const email = faker.internet.email(
    firstName.toLowerCase(),
    lastName.toLowerCase(),
    'authorify.com',
  );

  const dto = {
    image: faker.image.imageUrl(),
    hubspotId: faker.datatype.number().toString(),
    email,
    name,
    calendarId: email,
    meetingLink: faker.internet.url(),
    schedulingPoints: 0,
    enabled: true,
    ...toOverride,
  };

  return coachesService.create(dto);
}

export async function setAllCoachesSchedulingPoints(
  coachesService: CoachesService,
  schedulingPoints = 10,
): Promise<void> {
  {
    const totalCoaches = await coachesService.count();
    const allCoaches = await coachesService.findAllPaginated(0, totalCoaches);
    for (const coach of allCoaches.data) {
      await coachesService.update(coach._id.toString(), <UpdateCoachDto>{
        schedulingPoints,
      });
    }
  }
}

export async function createOffer(
  onboardService: OnboardService,
  toOverride: Partial<CreateOfferDto> = {},
) {
  const offerDto = <CreateOfferDto>{
    image: faker.image.imageUrl(),
    code: 'offer-1234',
    type: OfferType.MAIN,
    ...toOverride,
  };
  return onboardService.createOffer(offerDto);
}
