"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOffer = exports.setAllCoachesSchedulingPoints = exports.createCoach = void 0;
const faker_1 = require("@faker-js/faker");
const types_1 = require("../../domain/types");
async function createCoach(coachesService, toOverride = {}) {
    const firstName = faker_1.faker.name.firstName();
    const lastName = faker_1.faker.name.lastName();
    const name = `${firstName} ${lastName}`;
    const email = faker_1.faker.internet.email(firstName.toLowerCase(), lastName.toLowerCase(), 'authorify.com');
    const dto = Object.assign({ image: faker_1.faker.image.imageUrl(), hubspotId: faker_1.faker.datatype.number().toString(), email,
        name, calendarId: email, meetingLink: faker_1.faker.internet.url(), schedulingPoints: 0, enabled: true }, toOverride);
    return coachesService.create(dto);
}
exports.createCoach = createCoach;
async function setAllCoachesSchedulingPoints(coachesService, schedulingPoints = 10) {
    {
        const totalCoaches = await coachesService.count();
        const allCoaches = await coachesService.findAllPaginated(0, totalCoaches);
        for (const coach of allCoaches.data) {
            await coachesService.update(coach._id.toString(), {
                schedulingPoints,
            });
        }
    }
}
exports.setAllCoachesSchedulingPoints = setAllCoachesSchedulingPoints;
async function createOffer(onboardService, toOverride = {}) {
    const offerDto = Object.assign({ image: faker_1.faker.image.imageUrl(), code: 'offer-1234', type: types_1.OfferType.MAIN }, toOverride);
    return onboardService.createOffer(offerDto);
}
exports.createOffer = createOffer;
//# sourceMappingURL=index.js.map