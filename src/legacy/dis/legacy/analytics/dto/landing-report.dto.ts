export class LandingReportDto {
  name: string;
  email: string;
  count: number;
}

export class LandingReportRequestDto {
  size?: number;
  sort?: string;
  q?: string;
}
