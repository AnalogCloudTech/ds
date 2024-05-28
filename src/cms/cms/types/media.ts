export class Media {
  name: string;
  alternativeText: string;
  url: string;
  formats: any;
}

export class MediaCMS {
  data: {
    id: number;
    attributes: {
      name: string;
      url: string;
    };
  };
}
