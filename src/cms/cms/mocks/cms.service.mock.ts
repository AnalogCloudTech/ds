import { cmsMagazineResponseMock } from '@/cms/cms/mocks/data.mocked';

export class CmsServiceMock {
  magazineDetails(magazineId: string) {
    return cmsMagazineResponseMock;
  }

  magazineData(month: string, year: string) {
    return [cmsMagazineResponseMock];
  }
}
